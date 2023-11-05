//REFACTORED

import React, { useState, useEffect } from "react";
import axios from "axios";
import { web3Enable, web3AccountsSubscribe, web3FromAddress } from "@polkadot/extension-dapp";

const apiEndpoint = "http://167.99.229.96:50088/info";

const fetchExtensions = async () => {
  const extensions = await web3Enable("Commune");
  if (extensions.length === 0) {
    throw new Error("Polkadot.js extension not found.");
  }
  return extensions;
};

const subscribeToAccounts = async (setSelectedAccount) => {
  await web3AccountsSubscribe((accounts) => {
    if (accounts.length > 0) {
      setSelectedAccount(accounts[0]);
    }
  });
};

const AccountDisplay = ({ account }) => {
  if (!account) return null;
  return (
    <div>
      <span>
        Connected as: {account.meta.name} ({account.address})
      </span>
    </div>
  );
};

const executePostRequest = async (data) => {
  const response = await axios.post(apiEndpoint, data);
  console.log(response.data);
};

const signDataWithAccount = async (account, data) => {
  const injector = await web3FromAddress(account.address);
  const signRaw = injector?.signer?.signRaw;
  if (!signRaw) {
    throw new Error("The method signRaw is not available on the signer");
  }
  return await signRaw({
    address: account.address,
    data: JSON.stringify(data),
    type: "bytes",
  });
};

const MainScreen = () => {
  const [extensionDetected, setExtensionDetected] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await fetchExtensions();
        setExtensionDetected(true);
        await subscribeToAccounts(setSelectedAccount);
      } catch (error) {
        console.error(error.message);
      }
    };
    init();
  }, []);

  const handlePostRequest = async () => {
    const postData = { data: '{"args": [], "kwargs": {}}' };
    try {
      await executePostRequest(postData);
    } catch (error) {
      console.error("Error during post request:", error);
    }
  };

  const handlePostRequest2 = async () => {
    const serverData = {
      args: [],
      kwargs: {},
      ip: "167.99.229.96",
      timestamp: Math.floor(Date.now() / 1000),
      hash: "9b44a42788425d19de82f930640e41b2a56f4e3b25eccca50a90b95e79ede994",
    };

    try {
      if (!selectedAccount) {
        throw new Error("No account selected.");
      }
      const { signature } = await signDataWithAccount(selectedAccount, serverData);
      const data = {
        data: JSON.stringify(serverData),
        crypto_type: 1,
        signature,
        address: selectedAccount.address,
      };
      const response = await axios.post(apiEndpoint, data);
      console.log("Raw Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button onClick={handlePostRequest}>Send Request</button>
      <button onClick={handlePostRequest2}>Send Request 2</button>
      {!extensionDetected && <button onClick={() => console.error("Please install the Polkadot.js extension.")}>Detect Polkadot.js Extension</button>}
      <AccountDisplay account={selectedAccount} />
    </div>
  );
};

export default MainScreen;
