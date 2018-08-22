import React, { Component } from "react";
import { Feed } from "semantic-ui-react";
import Post from "./Post";

export default class Stream extends Component {
  render() {
    return (
      <Feed>
        {this.props.posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </Feed>
    );
  }
}
