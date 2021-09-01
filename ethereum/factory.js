import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xA9c36D551CdB05412Bfc68327dF22C14e77447C6"
);

export default instance;
