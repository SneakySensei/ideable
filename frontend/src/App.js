import React from "react";

import LoginPage from "./screens/LoginPage";

import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { token: localStorage.getItem("localStorageJwtToken") };
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <LoginPage />
      </div>
    );
  }
}
