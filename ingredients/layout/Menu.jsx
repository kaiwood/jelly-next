import { Menu, Icon } from "semantic-ui-react";
import Logo from "./Logo";

export default props => (
  <Menu compact secondary icon="labeled">
    <Menu.Item>
      <Logo />
    </Menu.Item>

    <Menu.Item name="server" onClick={() => props.navigation("/timeline")}>
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
