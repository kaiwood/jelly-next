import React from "react";
import App, { Container } from "next/app";
import { Layout } from "../ingredients/layout";
import Router from "next/router";

export default class MyApp extends App {
  navigation = page => {
    Router.push(page);
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Layout navigation={this.navigation}>
          <Component {...pageProps} />
        </Layout>
      </Container>
    );
  }
}
