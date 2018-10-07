import { Dropdown } from "semantic-ui-react";

export default function({ options, placeholder, onChange, value }) {
  return (
    <Dropdown
      placeholder={placeholder}
      inline
      options={options}
      onChange={onChange}
      value={value}
      style={{ marginBottom: "1.5rem", marginTop: "0.8rem" }}
    />
  );
}
