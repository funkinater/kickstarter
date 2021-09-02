import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
  };

  onContributionAmountChange(event) {
    this.setState({
      minimumContribution: event.target.value,
    });
    console.log("Current minimum value is " + event.target.value + ".");
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ errorMessage: "", loading: true });

    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        });

      Router.pushRoute("/");
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(event) => this.onContributionAmountChange(event)}
            />
          </Form.Field>
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
        <Message negative hidden={this.state.errorMessage == ""}>
          <Message.Header>Something went wrong!</Message.Header>
          <p>{this.state.errorMessage}</p>
        </Message>
      </Layout>
    );
  }
}

export default CampaignNew;
