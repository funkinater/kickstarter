const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("makes caller the manager", async () => {
    const manager = await campaign.methods.manager().call();

    assert.equal(accounts[0], manager);
  });

  it("allows contributors to donate to campaign", async () => {
    const account = accounts[1];
    await campaign.methods.contribute().send({
      value: "200",
      from: account,
    });

    const isApprover = await campaign.methods.approvers(account).call();

    assert(isApprover);
  });

  it("requires minimum contribution", async () => {
    const account = accounts[2];

    try {
      await campaign.methods.contribute().send({
        value: "50",
        from: account,
      });

      assert(false);
    } catch (err) {
      assert.ok(err);
    }
  });

  it("allows manager to make a request", async () => {
    const manager = accounts[0];

    try {
      await campaign.methods
        .createRequest("Some batteries", "100000", accounts[3])
        .send({
          from: manager,
          gas: "1000000",
        });

      const request = await campaign.methods.requests(0).call();

      assert.equal("Some batteries", request.description);
    } catch (err) {
      assert(false);
    }
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest(
        "Some large amount of money",
        web3.utils.toWei("5", "ether"),
        accounts[1]
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 103);
  });
});
