import React, { Component } from "react";
import { Header, Feed, Icon } from "semantic-ui-react";
import { Stream } from "../ingredients/stream";
import pnut from "pnut-butter";

export default class Index extends Component {
  static async getInitialProps() {
    const { data } = await pnut.global();
    return { posts: data };
  }

  render() {
    return (
      <>
        <Header as="h3">Timeline</Header>
        <Stream posts={this.props.posts} />
      </>
    );
  }
}
