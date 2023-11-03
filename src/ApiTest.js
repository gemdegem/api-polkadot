import axios from "axios";

const MainScreen = () => {
  const executePostRequest = async () => {
    const postData = {
      data: '{"args": [], "kwargs": {}}',
    };

    try {
      const response = await axios.post("http://167.99.229.96:50088/info", postData);
      console.log(response.data);
    } catch (error) {
      console.error("error during post request:", error.response ? error.response.data : error);
    }
  };

  return (
    <div>
      <button onClick={executePostRequest}>Send Request</button>
    </div>
  );
};

export default MainScreen;
