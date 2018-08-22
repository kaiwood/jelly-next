import React, { Component } from "react";
import Head from "next/head";

export default class Layout extends Component {
  render() {
    const { children } = this.props;

    return (
      <>
        <Head>
          <link rel="stylesheet" href="/static/semantic.min.css" />
          <link rel="stylesheet" href="/static/main.css" />
        </Head>
        <div className="layout">{children}</div>
      </>
    );
  }
}
