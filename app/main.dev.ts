import {
  app,
  BrowserWindow,
  dialog,
  ipcMain as ipc
} from 'electron';

import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer';

import Immutable from 'immutable';
import * as keytar from 'keytar';

import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import {
  CLOSE_EDIT_ENTRY,
  EDIT_ENTRY,
  ERROR_ALERT,
  OPEN_ENTRY_WINDOW
} from './constants/dialogs';

import {
	ACCOUNT_NAME,
	SERVICE_NAME
} from './constants/storage';

// Utils
import { defaultRouting, defaultUi } from './utils/DefaultStates';
import IpcApiMain from './utils/IpcApiMain';
import SettingsStorage from './utils/SettingsStorage';

// Main window
import MenuBuilder from './main/MenuBuilder';
import TrayBuilder from './main/Tray';

// Initialize store to share it between windows
import configureStore from './store';

// Set level
log.transports.file.level = 'debug';
log.transports.console.level = 'debug';

log.info(app.getPath('userData'));

// Define auto updater
autoUpdater.logger = log;

// @ts-ignore
autoUpdater.logger.transports.file.level = 'debug';
log.info('App starting...');

// Window, store, history etc. references
let mainWindow: BrowserWindow | null = null;
let entriesWindow: BrowserWindow | null = null;
let editWindow: BrowserWindow | null = null;
let trayBuilder: TrayBuilder | null = null;
let store: { getState: () => void; subscribe: (arg0: () => Promise<void>) => void; } | null = null;
let ipcApiMain: IpcApiMain | null = null;

if (process.env.NODE_ENV === 'production') {
  // tslint:disable-next-line:no-var-requires
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

process.on('unhandledRejection', (reason, p) => {
  // tslint:disable-next-line:no-console
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // tslint:disable-next-line:no-console
  console.log(reason.stack);
});

// Determine to DEBUG prod
const debugMode = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD;

if (debugMode === true) {
  log.info('Starting APP in DEBUG MODE!');
  // tslint:disable-next-line:no-var-requires
  require('electron-debug')(); // eslint-disable-line global-require
  // tslint:disable-next-line:no-var-requires
  const path = require('path'); // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  // tslint:disable-next-line:no-var-requires
  require('module').globalPaths.push(p); // eslint-disable-line
} else {
  log.info('Starting APP in PRODUCTION MODE');
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();

    if (trayBuilder) {
      trayBuilder.close();
    }
  }
});

/**
 * IPC window actions.
 */
ipc.on(EDIT_ENTRY, (_event, arg) => {
  openEditWindow(arg.id);
});

ipc.on(CLOSE_EDIT_ENTRY, () => {
  if (editWindow !== null) {
    editWindow.close();
    editWindow = null;
  }
});

ipc.on(OPEN_ENTRY_WINDOW, () => {
  openEntriesWindow();
});

ipc.on(ERROR_ALERT, (event, arg) => {
  dialog.showErrorBox('Error', String(arg));
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

// First state
let oldState = null;
let oldToken = null;

const persistState = async () => {
  // Get state
  const state = store.getState();
  // Persist only color of the icon for 'ui'
  const iconColor = state.getIn(['ui', 'icon']);
  const ui = iconColor ? defaultUi.set('icon', iconColor) : defaultUi;
  const newState = state
    .set('router', defaultRouting) // Never persist `routing`
    .set('ui', ui)
    .setIn(['user', 'token'], null) // Never store user data in insecure storage
    .setIn(['user', 'user'], null);

  // Handle whole store
  if (!oldState || newState.equals(oldState) === false) {
    await SettingsStorage.set('state', newState.toJS());
    log.info('Settings successfully stored');
    oldState = newState;
  }

  // Handle user data
  const userToken = state.getIn(['user', 'token']);
  if (!oldToken || oldToken !== userToken) {
    log.info('User token securely stored!');
    keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, userToken);
    oldToken = userToken;
  }
};

const openEditWindow = (id) => {
  if (entriesWindow === null) {
    return null;
  }

  if (editWindow !== null) {
    editWindow.close();
    editWindow = null;
  }

  editWindow = new BrowserWindow({
    show: false,
    title: 'Redmine Tracker - Edit',
    width: 500,
    height: 380,
    maximizable: true,
    fullscreenable: false,
    center: true,
    resizable: false,
    parent: entriesWindow
  });

  editWindow.entryIndex = id;

  editWindow.loadURL(`file://${__dirname}/edit.html`);

  editWindow
    .webContents
    .on('did-finish-load', () => {
      if (!editWindow) {
        throw new Error('"editWindow" is not defined');
      }

      editWindow.show();
      editWindow.focus();

      if (debugMode === true) {
        editWindow.openDevTools();
      }
    });

  editWindow.on('close', () => {
    editWindow = null;
  });

  return editWindow;
};

const openEntriesWindow = () => {
  if (entriesWindow === null) {
    entriesWindow = new BrowserWindow({
      show: false,
      title: 'Redmine Tracker - History',
      width: 850,
      height: 450,
      maximizable: true,
      fullscreenable: false,
      center: true,
      resizable: true
    });

    entriesWindow.loadURL(`file://${__dirname}/entries.html`);

    entriesWindow.webContents.on('did-finish-load', () => {
      if (!entriesWindow) {
        throw new Error('"entriesWindow" is not defined');
      }
      entriesWindow.show();
      entriesWindow.focus();

      if (debugMode === true) {
        entriesWindow.openDevTools();
      }
    });

    entriesWindow.on('closed', () => {
      entriesWindow = null;
    });
  } else {
    entriesWindow.show();
    entriesWindow.focus();
  }

  return entriesWindow;
};

const openMainWindow = () => {
  if (!mainWindow) {
    createMainWindow();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
};

const createMainWindow = async () => {
  if (debugMode === true) {
    try {
      await installExtensions();
    } catch (ex) {
      console.log(`Error when installing extensions: ${ex}`);
    }
  }

  // Get default state
  if (!store) {
    // Get store from unsecured electron storage
    oldState = await SettingsStorage.get('state', {});

    // Fetch password from secure keychain / libsecret-1-dev / Credential vault
    try {
      oldToken = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
    } catch (e) {
      log.debug(`Error from keytar: ${e}`);
      oldToken = null;
    }

    if (oldToken && oldState.user) {
      oldState.user.token = oldToken;
    }

    oldState = Immutable.fromJS(oldState);
    store = configureStore(oldState, 'main');

    // Persist state on changes
    store.subscribe(persistState);
  }

  // Create ipc main
  if (!ipcApiMain) {
    ipcApiMain = new IpcApiMain(store);
    ipcApiMain.bind();
  }

  // Get window bounds
  let bounds = {}
  try
  {
    bounds = await SettingsStorage.get('windowBounds', {});
  } catch (exception) {
    bounds = {};
  }

  const windowSettings = {
    show: false,
    title: 'Redmine Tracker',
    width: 400,
    height: 440,
    useContentSize: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    ...bounds
  };

  mainWindow = new BrowserWindow(windowSettings);
  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('close', async () => {
    const currentBounds = mainWindow.getBounds();
    await SettingsStorage.set('windowBounds', {
      x: currentBounds.x,
      y: currentBounds.y
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  if (trayBuilder == null) {
    trayBuilder = new TrayBuilder(store, openMainWindow);
    trayBuilder.buildIcon();
  }

  const menuBuilder = new MenuBuilder(mainWindow, openEntriesWindow, debugMode);
  menuBuilder.buildMenu();
};

app.on('ready', createMainWindow);

/**
 * App is ready, but update is required, have to quit it immediately.
 */
autoUpdater.on('updateRequired', () => {
  app.quit();
});

/**
 * Update is available... send message to views.
 */
autoUpdater.on('updateAvailable', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
  const index = dialog.showMessageBox(mainWindow, {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Redmine Tracker"',
    message: 'The new version has been downloaded. Please restart the application to apply the updates.',
    detail: `${releaseName}\n\n${releaseNotes}`
  });

  if (index === 1) {
    return;
  }

  // Restart app then update will be applied
  quitAndUpdate();
});

// On darwin platform - click on bar icon
// wil reopen / focus main window.
app.on('activate', () => {
  openMainWindow();
});
