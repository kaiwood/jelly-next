import React, { Component } from "react";
import pnut from "pnut-butter";
import { Stream } from "../ingredients/stream";
import { Header } from "semantic-ui-react";

export default class Posts extends Component {
  static async getInitialProps({ query: { id } }) {
    const { data } = await pnut.thread(id);
    return { posts: data };
  }

  render() {
    return (
      <>
        <Header as="h3">Post Nr. {this.props.postId}</Header>
        <Stream posts={this.props.posts} />
      </>
    );
  }
}
