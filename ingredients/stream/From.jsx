import React from "react";
import _ from "lodash";
import { Icon } from "semantic-ui-react";
import Link from "next/link";

export default function From({ post }) {
  return (
    <span>
      <Link
        href={`/users/@${_.get(post, "repost_of.user.username") ||
          _.get(post, "user.username")}`}
      >
        <a>
          @
          {_.get(post, "repost_of.user.username") ||
            _.get(post, "user.username")}
        </a>
      </Link>

      {_.get(post, "repost_of.user.username") ? (
        <span
          style={{
            fontWeight: "normal !important",
            color: "grey"
          }}
        >
          {" "}
          <Icon name="retweet" />
          <a>@{_.get(post, "user.username")}</a>
        </span>
      ) : null}
    </span>
  );
}
