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

    this.normalIcon = nativeImage.createFromPath(path.join(__dirname, '../assets/images/tray.png'));
    this.activeIcon = nativeImage.createFromPath(path.join(__dirname, '../assets/images/tray_active.png'));
  }

  buildIcon() {
    this.icon = new Tray(this.normalIcon);

    const contextMenu = Menu.buildFromTemplate([{
      label: 'Remove',
    }]);

    this.icon.setToolTip('Electron Demo in the tray.');
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
