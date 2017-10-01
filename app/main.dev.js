import {
  app,
  BrowserWindow,
  ipcMain as ipc,
  dialog
} from 'electron';

import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer';

import Immutable from 'immutable';

import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import {
  SETTINGS_LOAD_ERROR, ERROR_ALERT
} from './constants/dialogs';

import MenuBuilder from './main/MenuBuilder';
import TrayBuilder from './main/Tray';

// Initialize store to share it between windows
import configureStore from './store';

const store = configureStore(Immutable.fromJS({}), 'main');

// Set level
log.transports.console.level = 'debug';

// Define auto updater
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'debug';
log.info('App starting...');

let mainWindow = null;
let trayBuilder = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

// Determine to DEBUG prod
const debugMode = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD;

if (debugMode) {
  require('electron-debug')(); // eslint-disable-line global-require
  const path = require('path'); // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  require('module').globalPaths.push(p); // eslint-disable-line
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();

    if (trayBuilder) {
      trayBuilder.close();
    }
  }
});

ipc.on(SETTINGS_LOAD_ERROR, (event, arg) => {
  dialog.showErrorBox('Error', `Cannot load settings! (Error: ${arg[0]})`);

  // Quit only on production evn otherwise show errors
  if (process.env.NODE_ENV === 'production') {
    app.quit();
  } else {
    console.log(arg[1]);
  }
});

ipc.on(ERROR_ALERT, (event, arg) => {
  dialog.showErrorBox('Error', arg);
});

const installExtensions = async () => {
  let extensions = [
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS
  ];

  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  extensions = extensions.map(name => installExtension(name, forceDownload));
  return Promise.all(extensions);
};

const createMainWindow = async () => {
  if (debugMode) {
    try {
      await installExtensions();
    } catch (ex) {
      console.log(`Error when installing extensions: ${ex}`);
    }
  }

  mainWindow = new BrowserWindow({
    show: false,
    title: 'Redmine Tracker',
    width: 400,
    height: 500
  });

  mainWindow.setResizable(false);
  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (trayBuilder == null) {
    trayBuilder = new TrayBuilder(store);
    trayBuilder.buildIcon();
  }

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
};

app.on('ready', createMainWindow);

// On darwin platform - click on bar icon
// wil reopen / focus main window.
app.on('activate', async () => {
  if (!mainWindow) {
    createMainWindow();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
});
