import React from 'react';
import logo from './logo.svg';
import './App.css';
const flags = require('flags')
const WebRTCDirect = require('libp2p-webrtc-direct')
const multiaddr = require('multiaddr')
const mplex = require('libp2p-mplex')
const pull = require('pull-stream')
const listenFlag = 'listen'
flags.defineBoolean(listenFlag, false, 'Listen for incoming connections.')
flags.parse()
const listening = flags.get(listenFlag)
const maddr = multiaddr('/ip4/34.122.48.103/tcp/9090/http/p2p-webrtc-direct')
const direct = new WebRTCDirect()

direct.dial(maddr, { config: {} }, (err, conn) => {
  if (err) {
    console.log(`[dialer] Failed to open connection: ${err}`)
  }
  console.log('[dialer] Opened connection')
  const muxer = mplex.dialer(conn)
  const stream = muxer.newStream((err) => {
    console.log('[dialer] Opened stream')
    if (err) throw err
  })
  pull(
    pull.values(['hey, how is it going. I am the dialer']),
    stream
  )
})



function App() {
 
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
