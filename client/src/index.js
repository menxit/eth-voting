import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Web3 from 'web3';
import { EthereumProvider } from 'react-ethereum-provider';

ReactDOM.render(<EthereumProvider web3={Web3}><App /></EthereumProvider>, document.getElementById('root'));
registerServiceWorker();
