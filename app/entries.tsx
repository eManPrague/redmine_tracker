import { ipcRenderer as ipc, remote } from 'electron';
import log from 'electron-log';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// tslint:disable-next-line:no-commented-code
// import IpcApiRenderer from './utils/IpcApiRenderer';

// Containers + store
import Root from './containers/DefaultContainer';

// Global styles
import './app.global.css';

// Test if log run
log.info('Start entries frontend...');

// Bind error catcher
window.onerror = (error) => {
  ipc.send('errorInWindow', error);
  log.error(error);
};

render(
  <AppContainer>
		<Root />
  </AppContainer>,
  document.getElementById('root')
);
