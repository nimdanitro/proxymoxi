/*global chrome*/
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
    this.handleClick = this.handleClick.bind(this);

    // detect the intial state of the proxy settings
    chrome.proxy.settings.get({}, (details) => {
      if (details && details.levelOfControl == "controlled_by_this_extension") {
        this.setState({active: true})
      }
      else {
        this.setState({active: false})
      }
    })
  }

  // toggle the settings
  handleClick() {
    this.setState(prevState => ({
      active: !prevState.active
    }));
  }

  // hardcoded proxy settings for now
  setProxy() {
    let config = {
      mode: "pac_script",
      pacScript: {
        data: "function FindProxyForURL(url, host) {\n" +
              "  if (host == 'open.ch')\n" +
              "    return 'DIRECT';\n" +
              "  return 'PROXY 127.0.0.1:3130';\n" +
              "}"
      }
    };

    chrome.proxy.settings.set(
        {value: config, scope: 'regular'},
        ()  => { 
          this.setState({config: config}).bind(this)
        }
    );
  }

  // clear the app specific proxy settings again
  unsetProxy() {
    chrome.proxy.settings.clear(
      {scope: 'regular'},
      ()  => { 
        this.setState({config: null}).bind(this)
      }
    );
  }

  render() {
    let {active} = this.state;

    if (active) {
      this.setProxy()
    }
    else {
      this.unsetProxy()
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to ProxyMoxi</h1>
        </header>
        <button onClick={this.handleClick}>
          {active ? 'Proxy ON' : 'Proxy OFF'}
        </button>
      </div>
    );
  }
}

export default App;
