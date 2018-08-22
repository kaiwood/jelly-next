import { Menu, Header, Icon } from "semantic-ui-react";

export default props => (
  <Menu compact secondary icon="labeled">
    <Menu.Item>
      <Header as="h2">
        JellyTime!
        <Header.Subheader>A pnut.io client</Header.Subheader>
      </Header>
    </Menu.Item>

    <Menu.Item name="server" onClick={() => props.navigation("/")}>
      <Icon name="server" />
      Timeline
    </Menu.Item>

    <Menu.Item
      name="conversation"
      onClick={() => props.navigation("/messages")}
    >
      <Icon name="conversation" />
      Messages
    </Menu.Item>
    <Menu.Item name="cog" onClick={() => props.navigation("/settings")}>
      <Icon name="cog" />
      Settings
    </Menu.Item>
  </Menu>
);
