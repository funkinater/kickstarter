import React, {Component} from 'react';
import Layout from '../../../components/Layout';
import { Form, Input, Button, Grid, Message } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Link, Router} from '../../../routes';

class RequestNew extends Component {
    state = {
        value: '',
        description: '',
        recipient: '',
        loading: false,
        errorMessage: ''
    }
    static async getInitialProps(props) {
        const { address } = props.query;

        return { address };
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);
        const { description, value, recipient } = this.state;

        try {
            this.setState({loading:true, errorMessage: ''});
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value,'ether'),
                recipient).send({
                from: accounts[0]
            });

            Router.pushRoute(`/campaign/${this.props.address}/requests`);
        } catch (err) {
            this.setState({errorMessage:err.message});
        }

        this.setState({loading:false})
    }

    render() {
        return (
            <Layout>
                <h3>Create a Request</h3>
                <Grid>
                    <Grid.Column width={8}>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Field>
                                <label>Description</label>
                                <Input
                                value={this.state.description}
                                onChange = {event => this.setState({description: event.target.value})}></Input>
                            </Form.Field>

                            <Form.Field>
                                <label>Value in Ether</label>
                                <Input
                                value={this.state.value}
                                onChange={event => this.setState({value: event.target.value})}></Input>
                            </Form.Field>

                            <Form.Field>
                                <label>Recipient Address</label>
                                <Input
                                value={this.state.recipient}
                                onChange={event => this.setState({recipient: event.target.value})}></Input>
                            </Form.Field>
                            <Message negative
                            header="Ooops!"
                            content={this.state.errorMessage}
                            hidden={this.state.errorMessage == ''} />
                            <Button primary loading={this.state.loading}>
                                Create!
                            </Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Layout>
        )
    }
}

export default RequestNew;
