// @flow
import path from 'path';
import {
  Tray,
  Menu
} from 'electron';

import * as Redux from 'redux';

export default class TrayBuilder {
  store: typeof Redux.Store;

  icon: Tray;

  constructor(store: Store) {
    this.store = store;
  }

  buildIcon() {
    const iconPath = path.join(__dirname, '../assets/images/tray.png');
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
