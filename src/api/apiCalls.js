import axios from "axios";
import { web3FromAddress } from "@polkadot/extension-dapp";

export const postRequest = async (selectedAccount) => {
  const endpoint = "http://167.99.229.96:50088/info";

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const serverData = {
    args: [],
    kwargs: {},
    ip: "167.99.229.96",
    timestamp: currentTimestamp,
    hash: "9b44a42788425d19de82f930640e41b2a56f4e3b25eccca50a90b95e79ede994",
  };

  const payloadAsString = JSON.stringify(serverData);

  try {
    if (!selectedAccount) {
      throw new Error("No account selected.");
    }

    const injector = await web3FromAddress(selectedAccount.address);

    const signRaw = injector?.signer?.signRaw;
    if (signRaw) {
      const { signature } = await signRaw({
        address: selectedAccount.address,
        data: payloadAsString,
        type: "bytes",
      });

      const data = {
        data: payloadAsString,
        crypto_type: 1,
        signature,
        address: selectedAccount.address,
      };

      const response = await axios.post(endpoint, data);
      console.log("Raw Response:", response.data);

      const jsonResponse = response.data.substring(response.data.indexOf("{"));
      const parsedResponse = JSON.parse(jsonResponse);

      if (parsedResponse && parsedResponse.data) {
        const nestedData = JSON.parse(parsedResponse.data);
        console.log("Nested Data:", nestedData);

        const finalData = nestedData.data;
        console.log("Final Data:", finalData);
      }
    } else {
      throw new Error("The method signRaw is not available on the signer");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
