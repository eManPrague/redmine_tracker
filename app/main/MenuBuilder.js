// @flow
import { app, Menu, shell, BrowserWindow } from 'electron';
import checkForUpdates from '../updater';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  debugMode: boolean;

  constructor(mainWindow: BrowserWindow, debugMode: boolean) {
    this.mainWindow = mainWindow;
    this.debugMode = debugMode;
  }

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
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click: () => {
          this.mainWindow.inspectElement(x, y);
        }
      }]).popup(this.mainWindow);
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'Tracker',
      submenu: [
        { label: 'About Redmine Tracker', selector: 'orderFrontStandardAboutPanel:' },
        { label: 'Check for updates', click: () => { checkForUpdates(this); } },
        { label: 'Entries history', click: () => { console.log('History'); } },
        { type: 'separator' },
        { label: 'Hide Redmine Tracker', accelerator: 'Command+H', selector: 'hide:' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', selector: 'hideOtherApplications:' },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
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
          type: 'separator'
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
        { label: 'Reload', accelerator: 'Command+R', click: () => { this.mainWindow.webContents.reload(); } },
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

  buildDefaultTemplate() {
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
          console.log('history');
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
          this.mainWindow.webContents.reload();
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click: () => {
          this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click: () => {
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
