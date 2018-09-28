import React from "react";

export default function Profile({ username }) {
  return <a href={`/users/${username}`}>@{username}</a>;
}
