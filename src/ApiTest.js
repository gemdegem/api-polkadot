import { useState } from "react";
import { PolkadotAccount } from "./components/PolkadotAccounts";
import { AccountDisplay } from "./components/AccountDisplay";
import { postRequest } from "./api/apiCalls";

const MainScreen = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <div>
      <PolkadotAccount setConnectedAccount={setSelectedAccount} />
      {selectedAccount && <AccountDisplay account={selectedAccount} />}
      <button onClick={() => postRequest(selectedAccount)}>Send Request</button>
    </div>
  );
};

export default MainScreen;
