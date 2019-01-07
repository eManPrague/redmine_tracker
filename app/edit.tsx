import { ipcRenderer as ipc } from 'electron';
import log from 'electron-log';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// tslint:disable-next-line:no-commented-code
// import IpcApiRenderer from './utils/IpcApiRenderer';

// Containers + store
import Root from './containers/DefaultContainer';

// Global styles
import './app.global.css';

// Current window
// const currentWindow: any = remote.getCurrentWindow();

// Test if log run
// log.info(`Start edit entry ${currentWindow.entryIndex}...`);

// Bind error catcher
window.onerror = (error) => {
  ipc.send('errorInWindow', error);
  log.error(error);
};

// Init app
// const initialState = Immutable.fromJS(getInitialStateRenderer());
// const store = configureStore(initialState, 'renderer');

// Initialize renderer process
// const ipcApi = new IpcApiRenderer(store);
// ipcApi.bind();

render(
	<AppContainer>
		<Root />
	</AppContainer>,
  document.getElementById('root')
);

// @ts-ignore
if (module.hot) {
	// @ts-ignore
  module.hot.accept('./containers/DefaultContainer', () => {
    // tslint:disable-next-line:variable-name
    const NextRoot = require('./containers/DefaultContainer');
    render(
			<AppContainer>
				<NextRoot />
			</AppContainer>,
      document.getElementById('root')
    );
  });
}
