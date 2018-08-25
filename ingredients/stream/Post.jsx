import { Feed, Icon } from "semantic-ui-react";
import Timestamp from "./Timestamp";
import Link from "next/link";
import _ from "lodash";

const Post = ({ post }) => (
  <Feed.Event key={post.id}>
    <Feed.Label image={_.get(post, "user.content.avatar_image.link")} />
    <Feed.Content>
      <Feed.Summary>
        <a>@{_.get(post, "user.username")}</a>
        <Timestamp time={_.get(post, "created_at")} />
      </Feed.Summary>
      <Feed.Extra text>{_.get(post, "content.text")}</Feed.Extra>
      <Feed.Meta>
        <Link href={`/posts/${post.id}`}>
          <a>
            <Icon name="conversation" /> Conversation
          </a>
        </Link>
      </Feed.Meta>
    </Feed.Content>
  </Feed.Event>
);

export default Post;
