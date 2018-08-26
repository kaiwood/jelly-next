import React, { Component } from "react";
import { Header } from "semantic-ui-react";

export default class Index extends Component {
  render() {
    return (
      <>
        <Header as="h3">Login</Header>
        <a href="/auth/pnut">Authenticate via pnut.io</a>
      </>
    );
  }
}
