import React from "react";

export default function Tag({ tag }) {
  return <a href={`/tags/${tag}`}>#{tag}</a>;
}
