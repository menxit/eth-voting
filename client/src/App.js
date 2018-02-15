import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { withEthereum } from 'react-ethereum-provider'
import Votazioni from './Votazioni.json';
import Web3 from 'web3';
const verificaCF = require('codice-fiscale-italiano');
const { aClient, bClient } = require('./factory');
const TruffleContract = require('truffle-contract');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      registrato: false,
      step2: false,
      '0xf17f52151EbEF6C7334FAD080c5704D77216b732': null,
      '0x627306090abaB3A6e1400e9345bC60c78a8BEf57': null,
      '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef': null,
    };
  }

  registrati(e) {
    e.preventDefault();
    const cf = this.refs.cf.value;
    if(!verificaCF(cf)) {
      alert('Codice fiscale non valido!');
    } else {
      bClient.post('encrypt', { plain_text: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57' })
        .then(data => aClient.post('token', { cf, encrypted_address: data.encrypted }))
        .then(({ token }) => bClient.post('signup', { token }))
        .then(result => this.setState({ step2: true }))
        .catch(error => alert("Codice fiscale già usato o non valido!"));
    }
  }

  vota(event) {
    const address = event.target.getAttribute('data-address');
    const web3Provider = this.props.ethereum.connection.web3.currentProvider;
    const artifact = Votazioni;
    const VotazioniContract = TruffleContract(artifact);
    VotazioniContract.setProvider(web3Provider);

    VotazioniContract.deployed()
      .then(instance => instance.vota(address, { from: this.props.ethereum.accounts.value[0] }))
      .catch(error => {
        alert("Errore, guarda la console");
        console.error(error);
      });

  }

  caricaVoti(e) {
    const address = e.target.getAttribute('data-address');
    const web3Provider = this.props.ethereum.connection.web3.currentProvider;
    const artifact = Votazioni;
    const VotazioniContract = TruffleContract(artifact);
    VotazioniContract.setProvider(web3Provider);

    VotazioniContract.deployed()
      .then(instance => instance.votiByCandidato.call(address))
      .then(result => this.setState({ [address]: result.length }))
      .catch(error => {
        alert("Errore, guarda la console");
        console.error(error);
      });
  }

  render() {
    const ethereum = this.props.ethereum;

    if(this.props.ethereum.connection && this.props.ethereum.connection.web3) {
      const web3Provider = this.props.ethereum.connection.web3.currentProvider;
      const artifact = Votazioni;
      const VotazioniContract = TruffleContract(artifact);
      VotazioniContract.setProvider(web3Provider);

      VotazioniContract.deployed()
        .then(instance => Promise.all([
          instance.votiByCandidato.call('0xf17f52151EbEF6C7334FAD080c5704D77216b732'),
          instance.votiByCandidato.call('0x627306090abaB3A6e1400e9345bC60c78a8BEf57'),
          instance.votiByCandidato.call('0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef'),
        ])
          .then(results => this.setState({
            '0xf17f52151EbEF6C7334FAD080c5704D77216b732': results[0].length,
            '0x627306090abaB3A6e1400e9345bC60c78a8BEf57': results[1].length,
            '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef': results[2].length,
          })));
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Paperopoli alle urne</h1>
        </header>

        {!this.state.step2 && <form onSubmit={this.registrati.bind(this)} className="registrazione">
          <input ref="cf" className="registrazione__input" name="cf" type="text" placeholder="Codice fiscale" />
          <input className="registrazione__btn" type="submit" value="registrati" />
        </form>}

        {this.state.step2 && <div>

          <ul className="rappresentanti">
            <li>
              <img onClick={this.vota.bind(this)} data-address="0xf17f52151EbEF6C7334FAD080c5704D77216b732" src="paperone.png" />
              <span><a data-address="0xf17f52151EbEF6C7334FAD080c5704D77216b732" onClick={this.caricaVoti.bind(this)}>Carica voti</a> {this.state['0xf17f52151EbEF6C7334FAD080c5704D77216b732'] != null && <span>{this.state['0xf17f52151EbEF6C7334FAD080c5704D77216b732']} voti</span>}</span>
            </li>
            <li>
              <img onClick={this.vota.bind(this)} data-address="0x627306090abaB3A6e1400e9345bC60c78a8BEf57" src="paperino.png" />
              <span><a data-address="0x627306090abaB3A6e1400e9345bC60c78a8BEf57" onClick={this.caricaVoti.bind(this)}>Carica voti</a> {this.state['0x627306090abaB3A6e1400e9345bC60c78a8BEf57'] != null && <span>{this.state['0x627306090abaB3A6e1400e9345bC60c78a8BEf57']} voti</span>}</span>
            </li>
            <li>
              <img onClick={this.vota.bind(this)} data-address="0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef" src="rockerduck.png" />
              <span><a data-address="0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef" onClick={this.caricaVoti.bind(this)}>Carica voti</a> {this.state['0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef'] != null && <span>{this.state['0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef']} voti</span>}</span>
            </li>
          </ul>

        </div>}

      </div>
    );
  }

}

export default withEthereum()(App);
