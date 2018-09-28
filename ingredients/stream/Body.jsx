import React from "react";
import Profile from "./Profile";
import Tag from "./Tag";

import { Parser as HtmlToReactParser } from "html-to-react";
import { ProcessNodeDefinitions } from "html-to-react";

const Body = props => {
  return <div>{prepPost(props.content)}</div>;
};

export default Body;

function prepPost(content) {
  let htmlToReactParser = new HtmlToReactParser();

  const processNodeDefinitions = new ProcessNodeDefinitions(React);

  const isValidNode = function() {
    return true;
  };

  const processingInstructions = [
    {
      replaceChildren: true,
      shouldProcessNode: function(node) {
        return (
          node.attribs &&
          (node.attribs["data-mention-name"] || node.attribs["data-tag-name"])
        );
      },
      processNode: function(node, children, index) {
        if (node.attribs["data-mention-name"]) {
          return <Profile username={node.attribs["data-mention-name"]} />;
        } else if (node.attribs["data-tag-name"]) {
          return <Tag tag={node.attribs["data-tag-name"]} />;
        } else {
          return null;
        }
      }
    },
    {
      // Anything else
      shouldProcessNode: function(node) {
        return true;
      },
      processNode: processNodeDefinitions.processDefaultNode
    }
  ];

  let el = document.createElement("div");

  el.innerHTML = content;

  for (let link of Array.from(el.getElementsByTagName("a"))) {
    link.setAttribute("target", "_blank");
  }

  return htmlToReactParser.parseWithInstructions(
    `<div>${el.innerHTML}</div>`,
    isValidNode,
    processingInstructions
  );
}
