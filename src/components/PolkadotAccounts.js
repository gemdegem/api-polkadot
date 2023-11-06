import { web3Enable, web3AccountsSubscribe, web3FromAddress } from "@polkadot/extension-dapp";
import { useState, useEffect } from "react";

export const PolkadotAccount = ({ setConnectedAccount }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(""); // Dodane do śledzenia indeksu wybranego konta
  const [extensionDetected, setExtensionDetected] = useState(false);

  useEffect(() => {
    const init = async () => {
      const extensions = await web3Enable("MyApp");
      if (extensions.length > 0) {
        setExtensionDetected(true);
        const unsubscribe = await web3AccountsSubscribe((allAccounts) => {
          if (Array.isArray(allAccounts)) {
            setAccounts(allAccounts);
          }
        });
        return () => unsubscribe && unsubscribe();
      }
    };

    init();
  }, []);

  const connectAccount = async (index) => {
    const account = accounts[index];
    const injector = await web3FromAddress(account.address);
    if (injector) {
      setConnectedAccount(account);
      setSelectedAccountIndex(index);
    }
  };

  const disconnectAccount1 = () => {
    setConnectedAccount(null);

    document.querySelector("select").value = "";
  };

  return (
    <div>
      {!extensionDetected && <div>Please install the Polkadot.js extension.</div>}
      {extensionDetected && (
        <div>
          <select value={selectedAccountIndex} onChange={(e) => connectAccount(e.target.value)}>
            <option hidden value="">
              Select Account
            </option>
            {accounts.map((account, index) => (
              <option key={account.address} value={index}>
                {account.meta.name} ({account.address})
              </option>
            ))}
          </select>
          <button onClick={disconnectAccount1}>Disconnect</button>
        </div>
      )}
    </div>
  );
};
