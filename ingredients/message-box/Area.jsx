import React, { Component } from "react";
import { Form, TextArea, Segment } from "semantic-ui-react";
import pnut from "pnut-butter";

export default class Area extends Component {
  state = {
    placeholder: "Write a post…",
    channel: null,
    currentText: null
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.channel) {
      this.setState({
        placeholder: `Write a message to ${nextProps.channel}`,
        channel: nextProps.channel
      });
    }
  }

  render() {
    return (
      <Form style={{ marginBottom: "1rem" }}>
        <TextArea
          autoHeight
          placeholder={this.state.placeholder}
          rows={2}
          onChange={this.onChange}
        />

        <Form.Group style={{ marginBottom: 0 }}>
          <Form.Button
            style={{ marginTop: "1rem" }}
            disabled={!this.state.currentText || !this.state.channel}
            onClick={this.send}
          >
            Send
          </Form.Button>
        </Form.Group>
      </Form>
    );
  }

  onChange = ev => {
    this.setState({ currentText: ev.target.value });
  };

  send = () => {
    pnut.token = this.props.token;
    pnut.custom(`/channels/${this.state.channel}/messages`, "POST", {
      text: this.state.currentText
    });
  };
}
