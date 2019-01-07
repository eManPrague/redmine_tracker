import {
	ipcMain,
	ipcRenderer,
	webContents
} from 'electron';

export type HandlerFunction = (...args: any[]) => void;

export type BusType = 'renderer' | 'main';

export const EVENT_BUS_ACTION = '_EVENT_BUS_ACTION';

export class EventBus {
  // Turn on-off debug mode
  static DEBUG_MODE = process.env.NODE_ENV === 'development';
	private handlers: { [event: string]: HandlerFunction[] } = {};
	private type: BusType;
	private ipc;

	/**
	 * Bus type.
	 * @param type Bus type (main / renderer proces)
	 */
	constructor(type: BusType = 'main') {
		this.type = type;

		if (this.type === 'main') {
			this.ipc = ipcMain;
		} else {
			this.ipc = ipcRenderer;
		}

		this.ipc.on(EVENT_BUS_ACTION, this.receiveEvent);
	}

	/**
	 * Accept event through IPC.
	 */
	receiveEvent = (id: string, data: { event: string, data: any }) => {
    if (this.hasEvent(data.event)) {
      this.handlers[data.event].forEach((fct) => {
        fct(data.data);
      });
    }
	}

  /**
   * Register handler.
   *
   * @param event Event name
   * @param handler Handler
   */
  on(event: string, handler: HandlerFunction): void {
    if (!this.hasEvent(event)) {
      this.handlers[event] = [];
    }

    if (EventBus.DEBUG_MODE) {
      // tslint:disable-next-line:no-console
      console.log(`-> EventBus - add handler for ${event}`);
    }

    this.handlers[event].push(handler);
  }

  /**
   * Trigger event with data object.
   *
   * @param event Event name
   * @param data Any data
   */
  trigger(event: string, data?: any) {
    if (EventBus.DEBUG_MODE) {
      // tslint:disable-next-line:no-console
      console.log(`-> EventBus - trigger handler for ${event} ${JSON.stringify(data)}`);
    }

		if (this.type === 'main') {
			// Send to all contents
			webContents.getAllWebContents().forEach((content) => {
				content.send(EVENT_BUS_ACTION, { event, data });
			});
		} else {
			this.ipc.send(EVENT_BUS_ACTION, { event, data });
		}
  }

  /**
   * Remove event handler.
   *
   * @param event Event name
   * @param handler Handler
   */
  off(event: string, handler: HandlerFunction): void {
    if (EventBus.DEBUG_MODE) {
      // tslint:disable-next-line:no-console
      console.log(`-> EventBus - remove handler for ${event}`);
    }

    if (this.hasEvent(event)) {
      const arr = this.handlers[event];
      const index = arr.indexOf(handler);

      if (index < 0) {
        // tslint:disable-next-line:no-console
        console.warn(`-> EventBus - remove handler for ${event} - fails because handler does not exists`);
      } else {
        this.handlers[event].splice(index, 1);
      }
    } else {
      // tslint:disable-next-line:no-console
      console.warn(`-> EventBus - remove handler for ${event} - fails because event does not exists`);
    }
  }

  /**
   * Is event already defined?
   *
   * @param event Event name
   * @return Boolean
   */
  private hasEvent(event: string): boolean {
    return (event in this.handlers);
  }
}
