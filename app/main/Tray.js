// @flow
import path from 'path';
import {
  Tray,
  Menu,
  nativeImage,
  app
} from 'electron';

import { changeIcon } from '../actions/ui';

// Icon enumerations
export const WHITE_ICON = 0;
export const BLACK_ICON = 1;

export default class TrayBuilder {
  store: any;
  icon: Tray;
  active: boolean;

  // Both icons
  normalIcon: Array<typeof nativeImage>;
  activeIcon: Array<typeof nativeImage>;
  activeColor: number;
  openMainWindow: any;

  constructor(store: any, openMainWindow: any) {
    this.store = store;
    this.active = false;
    this.openMainWindow = openMainWindow;

    // Set & prepare icon for tray
    this.activeColor = this.getIconColor();
    this.prepareIcons();
  }

  buildIcon() {
    this.icon = new Tray(this.normalIcon[this.activeColor]);

    const contextMenu = Menu.buildFromTemplate([{
      label: 'Show tracker',
      click: () => {
        this.openMainWindow();
      }
    }, {
      label: 'Switch icon color',
      click: () => {
        this.switchIcon();
      }
    }, {
      label: 'Quit application',
      click: () => {
        this.close();
        app.quit();
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
      TrayBuilder.generateIcon('white', ''),
      TrayBuilder.generateIcon('black', '')
    ];
    this.activeIcon = [
      TrayBuilder.generateIcon('white', '_active'),
      TrayBuilder.generateIcon('black', '_active')
    ];
  }

  static generateIcon(color: string, active: string): nativeImage {
    return nativeImage.createFromPath(path.join(__dirname, `../assets/images/tray_${color}${active}.png`));
  }

  switchIcon(): void {
    this.store.dispatch(
      changeIcon(this.activeColor === WHITE_ICON ? 'black' : 'white')
    );
  }

  getIconColor(state: any = this.store.getState()): number {
    let color = 'black';

    if (state.has('ui')) {
      color = state.get('ui').get('icon');
    }

    return (color === 'white' ? WHITE_ICON : BLACK_ICON);
  }

  handleChange = () => {
    const state = this.store.getState();

    const oldColor = this.activeColor;
    this.activeColor = this.getIconColor(state);

    let changedIcon = false;

    if (state.has('entries') && state.get('entries').has('current')) {
      const startTime = parseInt(state.get('entries').get('current').get('startTime'), 10);

      if (startTime > 0 && this.active === false) {
        this.active = true;
        this.icon.setImage(this.activeIcon[this.activeColor]);
        changedIcon = true;
      } else if (startTime === 0 && this.active) {
        this.active = false;
        this.icon.setImage(this.normalIcon[this.activeColor]);
        changedIcon = true;
      }
    }

    // This always changes icon to normal icon, it's because
    // if there is active entry code above changes icon to proper one.
    if (changedIcon === false && oldColor !== this.activeColor) {
      this.icon.setImage(this.normalIcon[this.activeColor]);
    }
  }

  /**
   * This function remove icon, is called before APP close.
   */
  close() {
    this.icon.destroy();
  }
}
