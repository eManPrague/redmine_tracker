// @flow
import path from 'path';
import {
  Tray,
  Menu,
  nativeImage
} from 'electron';

export default class TrayBuilder {
  store: any;

  icon: Tray;

  active: boolean;

  // Both icons
  normalIcon: typeof nativeImage;
  activeIcon: typeof nativeImage;

  constructor(store: any) {
    this.store = store;
    this.active = false;

    // Icon name
    let normalName = 'tray.png';
    let activeName = 'tray_active.png';

    if (process.platform === 'win32') {
      normalName = 'tray_win.png';
      activeName = 'tray_active_win.png';
    }

    // Relative app path
    const appPath = path.join(__dirname, '../assets/images/');
    this.normalIcon = nativeImage.createFromPath(path.join(appPath, normalName));
    this.activeIcon = nativeImage.createFromPath(path.join(appPath, activeName));
  }

  buildIcon() {
    this.icon = new Tray(this.normalIcon);

    const contextMenu = Menu.buildFromTemplate([{
      label: 'Remove',
    }]);

    // Set basic stuff
    this.icon.setToolTip('RedmineTracker!');
    this.icon.setContextMenu(contextMenu);

    // Start watching
    this.store.subscribe(this.handleChange);
  }

  handleChange = () => {
    const state = this.store.getState();

    if (state.has('entries') && state.get('entries').has('current')) {
      const startTime = parseInt(state.get('entries').get('current').get('startTime'), 10);

      if (startTime > 0 && this.active === false) {
        this.active = true;
        this.icon.setImage(this.activeIcon);
      } else if (startTime === 0 && this.active) {
        this.active = false;
        this.icon.setImage(this.normalIcon);
      }
    }
  }

  close() {
    this.icon.destroy();
  }
}
