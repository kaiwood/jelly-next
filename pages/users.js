import React, { Component } from "react";
import pnut from "pnut-butter";
import { Stream } from "../ingredients/stream";
import { Header, Image } from "semantic-ui-react";
import _ from "lodash";

export default class Users extends Component {
  static async getInitialProps({ query: { username } }) {
    return { username };
  }

  state = {
    posts: [],
    user: [],
    loaded: false
  };

  async componentDidMount() {
    const { username } = this.props;

    const results = await Promise.all([
      pnut.user(username),
      pnut.custom(`/users/${username}/posts`)
    ]);

    this.setState({
      user: results[0].data,
      posts: results[1].data,
      loaded: true
    });
  }

  render() {
    return (
      <>
        {this.state.loaded ? (
          <>
            <Image
              src={`${_.get(this.state.user, "content.avatar_image.link")}`}
              avatar
              size="small"
            />
            <Header as="h3">User @{this.state.user.username}</Header>
            <p
              dangerouslySetInnerHTML={{
                __html: _.get(this.state.user, "content.html")
              }}
            />
            <Image
              src={`${_.get(this.state.user, "content.cover_image.link")}`}
              size="large"
            />

            <hr />
            <Stream posts={this.state.posts} />
          </>
        ) : null}
      </>
    );
  }
}
