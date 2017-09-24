import {
  app,
  BrowserWindow,
  ipcMain as ipc,
  dialog
} from 'electron';

import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF } from 'electron-devtools-installer';

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

// Define auto updater
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow = null;
let trayBuilder = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
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
  if (process.env.NODE_ENV === 'development') {
    let extensions = [
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
      REACT_PERF
    ];

    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    extensions = extensions.map(name => installExtension(name, forceDownload));
    return Promise.all(extensions).catch(console.log);
  }
};

const createMainWindow = async () => {
  await installExtensions();

  mainWindow = new BrowserWindow({
    show: false,
    width: 400,
    height: 500
  });

  // Install extensions
  [REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS].forEach((val) => {
    installExtension(val)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
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

// On darwin platfrom - click on bar icon
// wil reopen / focus main window.
app.on('activate', async () => {
  if (!mainWindow) {
    createMainWindow();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
});
