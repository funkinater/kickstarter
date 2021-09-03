import React, {Component} from 'react';
import Layout from '../../../components/Layout';
import { Button } from 'semantic-ui-react';
import { Link } from '../../../routes';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;

        return { address: address }
    }
    
    render() {
        return (
            <Layout>
                <Link route={`/campaign/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary>
                            Add Request
                        </Button>
                    </a>
                </Link>
            </Layout>
        );
    }
}

export default RequestIndex;