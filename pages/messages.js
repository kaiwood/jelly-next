import React, { Component } from "react";
import { Dropdown, Loader } from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroller";
import _ from "lodash";
import pnut from "pnut-butter";

import { Area } from "../ingredients/message-box";
import { Stream } from "../ingredients/stream";

export default class Messages extends Component {
  state = {
    channels: [],
    messages: [],
    hasMore: false,
    subscriptionId: null,
    currentChannel: null
  };

  async componentDidMount() {
    pnut.token = sessionStorage.getItem("token");

    await this.fetchChannels();
    this.startSocketListener();

    // const channels = JSON.parse(localStorage.getItem("channels"));
    // const currentChannel = sessionStorage.getItem("currentChannel");

    // this.setState({ currentChannel, channels });
    // this.fetchMessages(currentChannel);
  }

  render() {
    return (
      <React.Fragment>
        <Area token={this.props.token} channel={this.state.currentChannel} />

        <Dropdown
          placeholder="Select Channel"
          inline
          options={this.state.channels}
          onChange={this.selectCurrentChannel}
          style={{ marginBottom: "1rem" }}
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
        ) : null}
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
    this.setState({ currentChannel: value });
    this.fetchMessages(value);
  };

  fetchMessages = async channelId => {
    const { meta, data } = await pnut.channelMessages(channelId, {
      updateMarker: 1,
      includeRaw: 1,
      connectionId: sessionStorage.getItem("connection_id")
    });

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
