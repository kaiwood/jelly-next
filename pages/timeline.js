import React, { Component } from "react";
import { Header } from "semantic-ui-react";
import { Stream } from "../ingredients/stream";
import pnut from "pnut-butter";

export default class Index extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    pnut.token = sessionStorage.getItem("token");
    const { data } = await pnut.unified();
    this.setState({ posts: data });
  }

  render() {
    return (
      <>
        <Header as="h3">Timeline</Header>
        {this.state.posts ? <Stream posts={this.state.posts} /> : null}
      </>
    );
  }
}
