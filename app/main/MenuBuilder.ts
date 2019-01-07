import { app, BrowserWindow, Menu, MenuItemConstructorOptions, shell } from 'electron';

import checkForUpdates from '../updater';

export default class MenuBuilder {
  /**
   *
   * Return if platform is windows or mac (usefull for updater, which does not work on linux).
   *
   * @returns {boolean}
   * @memberof MenuBuilder
   */
  static windowsOrMac(): boolean {
    return process.platform === 'darwin' || process.platform === 'win32';
	}

  // Default tracking window
  mainWindow: BrowserWindow;

  // History entries window
  entriesWindow?: BrowserWindow;

  // Function to open history window
  openEntriesWindow: () => BrowserWindow;

  // App is running in debug mode
  debugMode: boolean;

  constructor(mainWindow: BrowserWindow, openEntriesWindow: any, debugMode: boolean) {
    this.mainWindow = mainWindow;
    this.openEntriesWindow = openEntriesWindow;
    this.debugMode = debugMode;
  }

  /**
   *  Build application menu.
   *
   * @returns
   * @memberof MenuBuilder
   */
  buildMenu() {
    if (this.debugMode === true) {
      this.setupDevelopmentEnvironment();
    }

    let template;

    if (process.platform === 'darwin') {
      template = this.buildDarwinTemplate();
    } else {
      template = this.buildDefaultTemplate();
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
		// @ts-ignore
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click: () => {
					// @ts-ignore
          this.mainWindow.inspectElement(x, y);
        }
				// @ts-ignore
      }]).popup(this.mainWindow);
    });
  }

  openEntries = () => {
    this.entriesWindow = this.openEntriesWindow();
    this.entriesWindow.on('close', () => {
      this.entriesWindow = undefined;
    });
  }

  refreshWindows = () => {
    this.mainWindow.webContents.reload();
    if (this.entriesWindow) {
      this.entriesWindow.webContents.reload();
    }
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout = {
      label: 'Tracker',
      submenu: [
        { label: 'About Redmine Tracker', selector: 'orderFrontStandardAboutPanel:' },
        { label: 'Check for updates', click: () => { checkForUpdates(this); } },
        { label: 'History', click: () => { this.openEntries(); } },
        { type: 'separator' as "separator" },
        { label: 'Hide Redmine Tracker', accelerator: 'Command+H', selector: 'hide:' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', selector: 'hideOtherApplications:' },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' as "separator" },
        { label: 'Quit', accelerator: 'Command+Q', click: () => { app.quit(); } }
      ]
    };

    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },
        {
          type: 'separator' as "separator"
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        },
      ]
    };

    const subMenuViewDev = {
      label: 'View',
      submenu: [
				{ label: 'Reload', accelerator: 'Command+R', click: () => { this.refreshWindows(); } },
				// @ts-ignore
        { label: 'Toggle Developer Tools', accelerator: 'Alt+Command+I', click: () => { this.mainWindow.toggleDevTools(); } }
      ]
    };

    const subMenuHelp = {
      label: 'Help',
      submenu: [
        { label: 'Learn More', click() { shell.openExternal('http://electron.atom.io'); } },
        { label: 'Documentation', click() { shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme'); } },
        { label: 'Community Discussions', click() { shell.openExternal('https://discuss.atom.io/c/electron'); } },
        { label: 'Search Issues', click() { shell.openExternal('https://github.com/atom/electron/issues'); } }
      ]
    };

    const menu = [
      subMenuAbout,
      subMenuEdit
    ];

    if (this.debugMode) {
      menu.push(subMenuViewDev);
    }

    menu.push(subMenuHelp);

    return menu;
  }

  buildDefaultTemplate(): MenuItemConstructorOptions[] {
    const templateDefault = [{
      label: '&File',
      submenu: [{
        label: '&Open',
        accelerator: 'Ctrl+O'
      }, {
        label: 'Check for &Update',
        accelerator: 'Ctrl+U',
        click: () => {
          checkForUpdates(this);
        }
      }, {
        label: 'History',
        accelerator: 'Ctrl+H',
        click: () => {
          this.openEntries();
        }
      }, {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click: () => {
          this.mainWindow.close();
        }
      }]
    }, {
      label: '&Edit',
      submenu: [
        { label: 'Cut', accelerator: 'Ctrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Ctrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Ctrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'Ctrl+A', selector: 'selectAll:' }
      ]
    }, {
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click: () => {
          this.refreshWindows();
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click: () => {
					// @ts-ignore
          this.mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click: () => {
          this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('http://electron.atom.io');
        }
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
        }
      }, {
        label: 'Community Discussions',
        click() {
          shell.openExternal('https://discuss.atom.io/c/electron');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/atom/electron/issues');
        }
      }]
    }];

    return templateDefault;
  }
}
