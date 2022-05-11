import './App.css';
import { useState, useEffect } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';
import detectEthereumProvider from '@metamask/detect-provider';

function App() {
  const [metamask, setMetamask] = useState();
  const [account, setAccount] = useState('');

  useEffect(() => {
    isMetamaskInstalled();
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChange);
      window.ethereum.removeListener('chainChanged', handleBlockchainChange);
    }
  },[]);

  const isMetamaskInstalled = async () => {
    const provider = await detectEthereumProvider();
    if(provider) {
      setMetamask(provider);
      provider.on('accountsChanged', handleAccountsChange);
      provider.on('chainChanged', handleBlockchainChange);
    } else {
      console.log('Please install MetaMask');
    }
  }

  const handleAccountsChange = (accounts) => {
		setAccount(accounts[0]);
    console.log('Account changed');
	}

	const handleBlockchainChange = async (chainId) => {
		// reload page
    console.log('Chain ID changed');
    window.location.reload();
	}

  const loadAccount = async () => {
    try {
      if (metamask) {
        const accounts = await metamask.request({ method: 'eth_requestAccounts' });
        console.log('Account loaded: ', accounts[0]);
        setAccount(accounts[0]);
      } else {
        console.log('No metamask found');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const installMetamask = () => {
    const forwarderOrigin = 'http://localhost:9010';
    //We create a new MetaMask onboarding object to use in our app
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    onboarding.startOnboarding();
  }

  return (
    <div className="App">
      <header className="App-header">
        {metamask ? (<button onClick={isMetamaskInstalled}>Connected</button>) : (
          <>
            <button onClick={isMetamaskInstalled}>Connect</button>
            <button onClick={installMetamask}>Click here to install MetaMask!</button>
          </>
        )}
        {metamask ? (<button onClick={loadAccount}>Load account</button>) : null}
        <p>Account: {account}</p>
      </header>
    </div>
  );
}

export default App;
