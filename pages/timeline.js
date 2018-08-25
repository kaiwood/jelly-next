import React, { Component } from "react";
import { Header } from "semantic-ui-react";
import { Stream } from "../ingredients/stream";
import pnut from "pnut-butter";
import fetch from "isomorphic-unfetch";

export default class Index extends Component {
  state = {
    posts: []
  };

  componentDidMount() {
    fetch("/me", { credentials: "include" })
      .then(res => {
        return res.json();
      })
      .then(async json => {
        console.log(json.token);
        pnut.token = json.token;
        const { data } = await pnut.unified();
        this.setState({ posts: data });
      });
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
