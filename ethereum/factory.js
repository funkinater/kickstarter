import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x3a639F50420ED659CB00399Bd52C1a00aaF87185"
);

export default instance;
