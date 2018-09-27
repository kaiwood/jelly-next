import React from "react";
import App, { Container } from "next/app";
import { Layout } from "../ingredients/layout";
import Router from "next/router";

export default class JellyTime extends App {
  componentDidMount() {
    const token = sessionStorage.getItem("token");
    if (!token && window.location.pathname !== "/") {
      window.location = "/sync-auth";
    }
  }

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

  navigation = page => {
    Router.push(page);
  };
}
