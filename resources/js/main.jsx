import React from "react";
import ReactDOM from "react-dom/client";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datetime/css/react-datetime.css';
import 'src/index.css';
import 'animate.css';

import App from "src/App";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from 'src/redux/store';
// Context
import { OnlineProvider } from 'src/context/online';
import { AntMessageProvider } from 'src/context/ant-message';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <OnlineProvider>
            <AntMessageProvider>
              <App />
            </AntMessageProvider>
          </OnlineProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>  
  </React.StrictMode>
);