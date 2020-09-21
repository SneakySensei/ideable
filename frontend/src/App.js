import React from "react";
import jwt from "jsonwebtoken";

import LoginPage from "./screens/LoginPage";
import Dashboard from "./screens/Dashboard";

import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false, user: localStorage.getItem("user") };

    this.refresh = this.refresh.bind(this);
  }

  refresh() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      var decodedToken = jwt.decode(user.token);
      var dateNow = new Date();
      // Check if token inValid
      if (decodedToken.exp < dateNow.getTime() / 1000) {
        // Show Login page
        this.setState({ isLoggedIn: false, user: {} });
      } else {
        this.setState({ isLoggedIn: true, user: user });
      }
    } else {
      // Show Login Page
      this.setState({ isLoggedIn: false, user: {} });
    }
  }

  componentDidMount() {
    this.refresh();
  }

  render() {
    let screen;
    if (this.state.isLoggedIn) {
      screen = <Dashboard user={this.state.user} refresh={this.refresh} />;
    } else {
      screen = <LoginPage refresh={this.refresh} />;
    }

    return <div>{screen}</div>;
  }
}
