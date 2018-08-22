import React, { Component } from "react";
import { Feed } from "semantic-ui-react";
import ago from "s-ago";

export default class Timestamp extends Component {
  state = {
    parsedTimestamp: new Date(this.props.time),
    time: ago(new Date(this.props.time))
  };

  componentDidMount = () => {
    const interval = setInterval(() => {
      this.setState({ time: ago(this.state.parsedTimestamp) });
    }, 6000);

    this.setState({ interval });
  };

  componentWillUnmount = () => {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  };

  render() {
    return <Feed.Date>{this.state.time}</Feed.Date>;
  }
}
