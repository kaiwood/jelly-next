import React, { Component } from "react";
import pnut from "pnut-butter";
import { Stream } from "../ingredients/stream";
import { Header, Image } from "semantic-ui-react";
import _ from "lodash";

export default class Users extends Component {
  static async getInitialProps({ query: { id } }) {
    const results = await Promise.all([
      pnut.user(id),
      pnut.custom(`/users/${id}/posts`)
    ]);

    return { user: results[0].data, posts: results[1].data, userId: id };
  }

  render() {
    return (
      <>
        <Image
          src={`${_.get(this.props.user, "content.avatar_image.link")}`}
          avatar
          size="small"
        />

        <Header as="h3">User @{this.props.user.username}</Header>

        <p dangerouslySetInnerHTML={{ __html: this.props.user.content.html }} />

        <Image
          src={`${_.get(this.props.user, "content.cover_image.link")}`}
          size="large"
        />

        <hr />

        <Stream posts={this.props.posts} />
      </>
    );
  }
}
