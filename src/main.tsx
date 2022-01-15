import { render } from 'preact';
import { registerSW } from 'virtual:pwa-register';
import { App } from './app';
import './index.css';

registerSW();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<App />, document.getElementById('app')!);
