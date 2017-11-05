// @flow
import path from 'path';
import {
  Tray,
  Menu,
  nativeImage
} from 'electron';

import { changeIcon } from '../actions/ui';

export default class TrayBuilder {
  store: any;
  icon: Tray;
  active: boolean;

  // Icon enumeration
  WHITE_ICON = 0;
  BLACK_ICON = 1;

  // Both icons
  normalIcon: Array<typeof nativeImage>;
  activeIcon: Array<typeof nativeImage>;
  activeColor: number;

  constructor(store: any) {
    this.store = store;
    this.active = false;

    // Set & prepare icon for tray
    this.activeColor = this.getIconColor();
    prepareIcons();
  }

  buildIcon() {
    this.icon = new Tray(this.normalIcon[this.activeColor]);

    const contextMenu = Menu.buildFromTemplate([{
      label: 'Remove',
    }, {
      label: 'Switch icon color',
      click: () => {
        this.switchIcon();
      }
    }]);

    // Set basic stuff
    this.icon.setToolTip('RedmineTracker!');
    this.icon.setContextMenu(contextMenu);

    // Start watching
    this.store.subscribe(this.handleChange);
  }

  prepareIcons() {
    this.normalIcon = [
      this.generateIcon('black', ''),
      this.generateIcon('white', '')
    ];
    this.activeIcon = [
      this.generateIcon('black', '_active'),
      this.generateIcon('white', '_active')
    ];
  }

  generateIcon(color: string, active: string): typeof nativeImage {
    const appPath = path.join(__dirname, '../assets/images/');
    return nativeImage.createFromPath(path.join(`tray_${color}${active}.png`));
  }

  switchIcon(): void {
    this.store.dispatch(
      changeIcon(this.activeColor == TrayBuilder.WHITE_ICON ? 'black' : 'white')
    );
  }

  getIconColor(state: any): number {
    if (!state) {
      state = this.store.getState();
    }

    let color = 'black';

    if (state.has('ui')) {
      color = state.get('ui').get('icon');
    }

    let ret = color === 'white' ? TrayBuilder.WHITE_ICON : TrayBuilder.BLACK_ICON; 

    console.log(`Ret: ${ret}`);

    return ret;
  }

  handleChange = () => {
    const state = this.store.getState();

    this.activeColor = getIconColor(state);

    if (state.has('entries') && state.get('entries').has('current')) {
      const startTime = parseInt(state.get('entries').get('current').get('startTime'), 10);

      if (startTime > 0 && this.active === false) {
        this.active = true;
        this.icon.setImage(this.activeIcon[this.activeColor]);
      } else if (startTime === 0 && this.active) {
        this.active = false;
        this.icon.setImage(this.normalIcon[this.activeColor]);
      }
    }
  }

  /**
   * This function remove icon, is called before APP close.
   */
  close() {
    this.icon.destroy();
  }
}
