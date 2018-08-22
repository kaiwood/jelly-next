import React, { Component } from "react";
import Head from "next/head";
import { Container } from "semantic-ui-react";
import Menu from "./Menu";

export default class Layout extends Component {
  render() {
    const { children } = this.props;

    return (
      <>
        <Head>
          <link rel="stylesheet" href="/static/semantic.min.css" />
          <link rel="stylesheet" href="/static/main.css" />
        </Head>
        <div className="layout">
          <Container>
            <Menu navigation={this.props.navigation} />
            <div className="content-wrapper">{children}</div>
          </Container>
        </div>
      </>
    );
  }
}
