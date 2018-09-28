import React from "react";
import { Feed, Icon } from "semantic-ui-react";
import Timestamp from "./Timestamp";
import Link from "next/link";
import _ from "lodash";
import Body from "./Body";
import Oembedded from "./Oembedded";
import From from "./From";

const Post = ({ post, showMeta = true }) => (
  <Feed.Event key={post.id}>
    <Feed.Label
      image={
        _.get(post, "repost_of.user.content.avatar_image.link") ||
        _.get(post, "user.content.avatar_image.link")
      }
    />
    <Feed.Content>
      <Feed.Summary>
        <From post={post} />
        <Timestamp time={_.get(post, "created_at")} />
      </Feed.Summary>
      <Feed.Extra text>
        <Body content={_.get(post, "content.html") || ""} />
        <Oembedded post={post} />
      </Feed.Extra>
      {showMeta ? (
        <Feed.Meta>
          <Link href={`/posts?id=${post.id}`} as={`/posts/${post.id}`}>
            <a>
              <Icon name="conversation" /> Conversation
            </a>
          </Link>
        </Feed.Meta>
      ) : null}
    </Feed.Content>
  </Feed.Event>
);

export default Post;
