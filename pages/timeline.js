import React, { Component } from "react";
import { Header, Dropdown, Loader } from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroller";
import { Stream } from "../ingredients/stream";
import { Area } from "../ingredients/message-box";
import pnut from "pnut-butter";

export default class Timeline extends Component {
  static async getInitialProps({ req }) {
    if (req) return {};

    return { currentTimeline: sessionStorage.getItem("currentTimelime") };
  }

  state = {
    posts: [],
    currentTimeline: this.props.currentTimeline || "unified",
    hasMore: false
  };

  componentDidMount() {
    this.fetchPosts(this.state.currentTimeline);
  }

  render() {
    return (
      <React.Fragment>
        <Area />

        <Dropdown
          placeholder="Select stream"
          inline
          options={timelineOptions}
          onChange={this.selectCurrentTimeline}
          value={this.state.currentTimeline}
          style={{ marginBottom: "1rem" }}
        />

        {this.state.posts.length > 0 ? (
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={this.state.hasMore}
            value={this.state.currentTimeline}
            loader={<Loader active inline="centered" key={0} />}
          >
            <Stream posts={this.state.posts} />
          </InfiniteScroll>
        ) : (
          <Loader active inline="centered" key={0} />
        )}
      </React.Fragment>
    );
  }

  selectCurrentTimeline = async (_, { value }) => {
    this.setState({ currentTimeline: value, posts: [] });
    sessionStorage.setItem("currentTimeline", value);
    this.fetchPosts(value);
  };

  fetchPosts = async timeline => {
    pnut.token = sessionStorage.getItem("token");
    const { data } = await pnut[timeline]({ includeRaw: 1 });

    this.setState({ posts: data, hasMore: true });
  };

  loadMore = async () => {
    const { data } = await pnut[this.state.currentTimeline]({
      beforeId: this.state.posts[this.state.posts.length - 1].id,
      includeRaw: 1
    });

    this.setState({ posts: [...this.state.posts, ...data] });
  };
}

const timelineOptions = [
  {
    text: "Timeline",
    value: "unified"
  },
  {
    text: "Global",
    value: "global"
  }
];
