import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroller";
import _ from "lodash";
import pnut from "pnut-butter";

import { Area } from "../ingredients/message-box";
import { Stream } from "../ingredients/stream";
import { Dropdown } from "../ingredients/dropdown";

export default class Messages extends Component {
  static async getInitialProps({ req }) {
    if (req) return {};

    return {
      currentChannel: sessionStorage.getItem("currentChannel"),
      currentChannelDescription: sessionStorage.getItem(
        "currentChannelDescription"
      )
    };
  }

  state = {
    channels: this.props.currentChannel
      ? [
          {
            value: this.props.currentChannel,
            text: this.props.currentChannelDescription
          }
        ]
      : [],
    messages: null,
    hasMore: false,
    subscriptionId: null,
    currentChannel: this.props.currentChannel || null
  };

  componentDidMount() {
    pnut.token = sessionStorage.getItem("token");

    this.fetchChannels();

    if (this.state.currentChannel) {
      this.fetchMessages(this.state.currentChannel);
    }

    if (this.props.socket) {
      this.startSocketListener();
    } else {
      console.error("No socket available…");
    }
  }

  render() {
    return (
      <React.Fragment>
        <Area token={this.props.token} channel={this.state.currentChannel} />

        <Dropdown
          placeholder="Select Channel"
          options={this.state.channels}
          onChange={this.selectCurrentChannel}
          value={this.state.currentChannel}
        />

        {this.state.messages ? (
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={this.state.hasMore}
            loader={<Loader active inline="centered" key={0} />}
          >
            <Stream posts={this.state.messages} showMeta={false} />
          </InfiniteScroll>
        ) : (
          <Loader active inline="centered" key={0} />
        )}
      </React.Fragment>
    );
  }

  fetchChannels = async () => {
    const { data } = await pnut.subscribed({
      includeLimitedUsers: 1,
      includeChannelRaw: 1
    });

    const channels = data.filter(channel =>
      channel.type.startsWith("io.pnut.core")
    );

    this.setState({
      channels: channels.map(channel => ({
        text: channelDescription(channel),
        value: channel.id
      }))
    });

    localStorage.setItem("channels", JSON.stringify(channels));
  };

  selectCurrentChannel = async (ev, { value }) => {
    sessionStorage.setItem("currentChannel", value);
    const description = this.state.channels.filter(
      channel => channel.value === value
    )[0].text;
    sessionStorage.setItem("currentChannelDescription", description);

    this.setState({ currentChannel: value });
    this.fetchMessages(value);
  };

  fetchMessages = async channelId => {
    const params = {
      updateMarker: 1,
      includeRaw: 1
    };

    const connectionId = sessionStorage.getItem("connection_id");
    if (connectionId) {
      params.connectionId = connectionId;
    }

    const { meta, data } = await pnut.channelMessages(channelId, params);

    this.setState({
      messages: data,
      hasMore: true,
      subscriptionId: meta.subscription_id
    });
  };

  loadMore = async () => {
    const { data } = await pnut.channelMessages(this.state.currentChannel, {
      beforeId: this.state.messages[this.state.messages.length - 1].id,
      includeRaw: 1
    });

    this.setState({ messages: [...this.state.messages, ...data] });
  };

  startSocketListener = () => {
    this.props.socket.addEventListener("message", event => {
      const { meta, data } = JSON.parse(event.data);
      const subscriptionId = _.get(meta, "subscription_ids[0]");

      if (subscriptionId && this.state.subscriptionId === subscriptionId) {
        this.setState({ messages: [data, ...this.state.messages] });
      }
    });
  };
}

/**
 * TODO: Move filters to separate module
 */
function channelDescription(channel) {
  let description = "";

  if (channel.type === "io.pnut.core.pm") {
    description += `@${extractPrivateMessagePartner(channel)}`;
  } else {
    description += channel.raw.reduce(
      (prev, cur) => (cur.value && cur.value.name ? cur.value.name : prev),
      "Chat"
    );
  }

  description += ` [${channel.id}]`;
  return description;
}

function extractPrivateMessagePartner(channel) {
  let currentUser = sessionStorage.getItem("username");

  let users = [];
  users.push(...channel.acl.write.user_ids.map(id => `${id.username}`));
  users.push(`${channel.owner.username}`);

  users = [...new Set(users)];

  users = users.filter(user => user !== currentUser);

  return users[0];
}
