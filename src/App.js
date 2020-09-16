import React from 'react';
import logo from './logo.svg';
import './App.css';

const flags = require('flags')
const WebRTCDirect = require('libp2p-webrtc-direct')
const multiaddr = require('multiaddr')
const mplex = require('libp2p-mplex')
const pull = require('pull-stream')
const upgrader  = require('./upgrader');
const listenFlag = 'listen'
flags.defineBoolean(listenFlag, false, 'Listen for incoming connections.')
flags.parse()
const listening = flags.get(listenFlag)

const maddr = multiaddr('/ip4/34.122.48.103/tcp/9090/http/p2p-webrtc-direct')

 const direct = new WebRTCDirect({ upgrader })

console.log('listening .........',listening)  
if (listening) {
  const listener = direct.createListener({ config: {} }, (conn) => {
    console.log('[listener] Got connection')

    const muxer = mplex.listener(conn)

    muxer.on('stream', (stream) => {
      console.log('[listener] Got stream')
      pull(
      stream,
      pull.drain((data) => {
        console.log('[listener] Received:')
        console.log(data.toString())
      })
      )
    })
  })

  listener.listen(maddr, () => {
    console.log('[listener] Listening')
  })
} else {
(async function(){

  try {
    let conn = await direct.dial(maddr)

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
  } catch (error) {
      console.log(error);
  }

})();
  
  
}


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
