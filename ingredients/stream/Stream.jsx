import React, { Component } from "react";
import { Feed, Icon } from "semantic-ui-react";

export default class Stream extends Component {
  render() {
    return (
      <Feed>
        {this.props.posts.map(post => {
          return (
            <Feed.Event key={post.id}>
              <Feed.Label image={post.user.content.avatar_image.link} />
              <Feed.Content>
                <Feed.Summary>
                  <a>@{post.user.username}</a> posted
                  <Feed.Date>{post.created_at}</Feed.Date>
                </Feed.Summary>
                <Feed.Extra text>{post.content.text}</Feed.Extra>
                <Feed.Meta>
                  <Feed.Like>
                    <Icon name="like" />5 Likes
                  </Feed.Like>
                </Feed.Meta>
              </Feed.Content>
            </Feed.Event>
          );
        })}
      </Feed>
    );
  }
}
