import React from 'react';
import ReactDOM from 'react-dom';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import App from './App.js';

(async () => {
  const draw = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=1');
  const hand = await draw.json();
  const card = hand.cards[0];
  var deviceType = '';



//   if ( /newrelic|NewRelic|newRelic|New Relic/i.test(navigator.userAgent) ) 
//  // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent) ) 
//   {
//     deviceType = 'NewRelic';
//   }
//   else {
//    deviceType = 'humans';
//   }
//   console.log('users device is:', deviceType);

  if (localStorage.getItem("userGroup") === null) {
    deviceType = 'humans';
  } else {
    deviceType = 'NewRelic';
  }

  console.log('users device is:', deviceType);

  const LDProvider = await asyncWithLDProvider({
    clientSideID: process.env.REACT_APP_LD_CLIENT_SIDE_ID,
    reactOptions: {
      useCamelCaseFlagKeys: false
    },
    user: {
      key: card.code,
      avatar: card.image,
      custom: {
        groups: deviceType,
        card: card.code,
        suit: card.suit,
        face: card.value,
        selection: 'DEFAULT'
      }
    },
    flags: {
      'demoTheme': 'Default',
      'demoSoundEnabled': false,
      'demoQRCode': false,
      'demoAdmin': false,
      'demoBroken': false,
      'demoServerBroken': false
    }
  });

class JSXDemo extends React.Component {
  render() {
    return <h1>{deviceType}</h1>;
  }
}

  ReactDOM.render(
    <div>
    <JSXDemo></JSXDemo>
    <LDProvider>
      <App />
    </LDProvider>
    </div>,
    document.getElementById('root')
  );
})();