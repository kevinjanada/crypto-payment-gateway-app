import { useState } from "react";
import Torus from "@toruslabs/solana-embed";
import Web3 from "web3";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [account, setAccount] = useState();

  const onClickLogin = async (e: any) => {
    e.preventDefault();

    const torus = new Torus({});
    await torus.init({
      enableLogging: false,
    });
    await torus.login();

    const web3 = new Web3(torus.provider as any);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    setAccount({ address, balance } as any);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {account ? (
          <div className="App-info">
            <p>
              <strong>Address</strong>: {(account as any).address}
            </p>
            <p>
              <strong>Balance</strong>: {(account as any).balance}
            </p>
          </div>
        ) : (
          <>
            <p>You didn't login yet. Login to see your account details.</p>
            <button className="App-link" onClick={onClickLogin}>
              Login
            </button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
