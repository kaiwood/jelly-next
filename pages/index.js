import React, { Component } from "react";
import { Header, Feed, Icon } from "semantic-ui-react";
import { Stream } from "../ingredients/stream";
import pnut from "pnut-butter";

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
