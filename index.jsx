import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorkerRegistration from './src/serviceWorkerRegistration';
import App from './src/app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

serviceWorkerRegistration.register();
