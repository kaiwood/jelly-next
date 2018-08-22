import { Feed, Icon } from "semantic-ui-react";
import Timestamp from "./Timestamp";

const Post = ({ post }) => (
  <Feed.Event key={post.id}>
    <Feed.Label image={post.user.content.avatar_image.link} />
    <Feed.Content>
      <Feed.Summary>
        <a>@{post.user.username}</a> posted
        <Timestamp time={post.created_at} />
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

export default Post;
