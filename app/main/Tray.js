// @flow
import path from 'path';
import {
  Tray,
  Menu
} from 'electron';
import { Store } from 'redux';

export default class TrayBuilder {
  store: Store;

  icon: Tray;

  constructor(store: Store) {
    this.store = store;
  }

  buildIcon() {
    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, iconName);
    this.icon = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([{
      label: 'Remove',
    }]);

    this.icon.setToolTip('Electron Demo in the tray.');
    this.icon.setContextMenu(contextMenu);
  }

  close() {
    this.icon.destroy();
  }
}
