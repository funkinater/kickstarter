import React from "react";
import { Container } from "semantic-ui-react";
import Header from "./header";
import Head from "next/head";

const Layout = (props) => {
  return (
    <Container>
      <Head>
        <link
          async
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.0.0/dist/semantic.min.css"
        />
      </Head>
      <Header />
      {props.children}
    </Container>
  );
};

export default Layout;
