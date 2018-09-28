import React from "react";
import App, { Container } from "next/app";
import { Layout } from "../ingredients/layout";
import Router from "next/router";

export default class JellyTime extends App {
  state = {
    socket: null
  };
  componentDidMount() {
    const token = sessionStorage.getItem("token");
    if (!token && window.location.pathname !== "/") {
      window.location = "/sync-auth";
    }

    this.connectToUserStream(token);
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Layout navigation={this.navigation}>
          <Component {...pageProps} socket={this.state.socket} />
        </Layout>
      </Container>
    );
  }

  navigation = page => {
    Router.push(page);
  };

  connectToUserStream = async token => {
    const ws = new WebSocket(
      `wss://stream.pnut.io/v0/user?access_token=${token}`
    );

    let pingInterval = setInterval(() => {
      console.log("ping");
      ws.send("ping");
    }, 45000);

    ws.addEventListener("open", event => {
      console.log("Socket connection established");
      console.log(event.data);
    });

    ws.addEventListener("message", event => {
      let { meta, data } = JSON.parse(event.data);

      console.log(meta, data);

      if (meta.connection_id) {
        sessionStorage.setItem("connection_id", meta.connection_id);
      }
    });

    ws.addEventListener("close", event => {
      console.log("Socket closed");
      console.log(event);

      clearInterval(pingInterval);
    });

    this.setState({ socket: ws });
  };
}
