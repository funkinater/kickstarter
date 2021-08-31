const path = require("path");
const solc = require("solc");
const fs = require("fs-extra"); //fs-extra has extra functions tied to it

const buildPath = path.resolve(__dirname, "build");

//removeSync can remove folder and everything inside of it
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");

const source = fs.readFileSync(campaignPath, "utf-8");

const output = solc.compile(source, 1).contracts;

//create dir if not exist
fs.ensureDirSync(buildPath);

console.log(output);
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
