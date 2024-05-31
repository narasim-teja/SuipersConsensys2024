import './style.css';
import React from 'react'; 
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';


import { EnokiFlowProvider } from "@mysten/enoki/react";
import { createNetworkConfig, SuiClientProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";


// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});





const root = ReactDOM.createRoot(document.querySelector('#root'));



root.render(
  <React.StrictMode>
    <BrowserRouter>
    
    <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <EnokiFlowProvider apiKey={import.meta.env.REACT_APP_ENOKI_PUB_KEY}>
          <App/>
          
        </EnokiFlowProvider>
      </SuiClientProvider>
    
      
      
    </BrowserRouter>
  </React.StrictMode>
);
