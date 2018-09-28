import React, { Component } from "react";
import LazyLoad from "react-lazyload";
import { Image } from "semantic-ui-react";
import _ from "lodash";

export default class Ombedded extends Component {
  state = {
    currentUrl: null,
    original: null,
    thumbnail: null
  };

  componentDidMount() {
    this.setInitialImageUrls();
  }

  render() {
    if (this.state.currentUrl) {
      return (
        <LazyLoad height="100%">
          <Image
            className={"inline-image"}
            src={this.state.currentUrl}
            onClick={this.resizeImage}
          />
        </LazyLoad>
      );
    } else {
      return null;
    }
  }

  setInitialImageUrls() {
    const original = _.get(this.props.post, "raw[0].value.url");
    const thumbnail = _.get(this.props.post, "raw[0].value.thumbnail_url");

    this.setState({
      original,
      thumbnail,
      currentUrl: thumbnail || original
    });
  }

  resizeImage = () => {
    this.setState({
      currentUrl: this.state.original
    });
  };
}
