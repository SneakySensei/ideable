import React from "react";
import styled from "styled-components";

import colors from "../colors.json";
import logo from "../assets/ideable.svg";

const LoginContainer = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 2fr 3fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Login = styled.div`
  background-color: ${colors.foreground};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: white;

  .logo-mobile {
    display: none;
    color: ${colors.text};

    @media (max-width: 768px) {
      display: block;
    }

    header {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      font-size: 2rem;
      margin-bottom: 1rem;
      img {
        width: 4rem;
        margin-right: 0.2rem;
      }
    }
  }

  .container {
    /* background-color: ${colors.background}; */
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-self: stretch;
    padding: 0.75rem;
    width: 100%;
    max-width: 400px;
    transition: all 0.5s linear;

    .button {
      margin-top: 2rem;
      background-color: ${colors.blue};
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      text-align: center;
    }

    .label {
      margin: 1rem 0 0.5rem 0;
      color: ${colors.text};
      animation: slide-up 0.4s ease;
    }

    input {
      padding: 0.75rem 1rem;
      outline-style: none;
      border-radius: 0.5rem;
      background-color: ${colors.background};
      border: solid 1px ${colors.textgrey};
      color: white;
      animation: slide-up 0.4s ease;
    }

    .username {
      display: ${(props) => (props.signup ? "block" : "none")};
    }

    @keyframes slide-up {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  .signup-message {
    color: ${colors.text};
    cursor: default;

    span {
      color: ${colors.pink};
      cursor: pointer;

      &:hover {
        filter: brightness(1.2);
      }

      &:active {
        opacity: 0.8;
      }
    }
  }
`;

const Landing = styled.div`
  background-color: ${colors.background};
  display: grid;
  place-items: center;
  color: ${colors.text};
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Note = styled.div`
  background-color: ${colors.foreground};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 1rem 2rem;
  position: relative;
  border-radius: 0.5rem;
  -moz-border-radius: 0.5rem;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    border-width: 0 1.75rem 1.75rem 0;
    border-style: solid;
    border-color: ${colors.pink} ${colors.background};
    display: block;
    width: 0;
    -moz-border-radius: 0 0 0 0.5rem;
    border-radius: 0 0 0 0.5rem;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3),
      -1px 1px 1px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3),
      -1px 1px 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3), -1px 1px 1px rgba(0, 0, 0, 0.2);
  }

  .title {
    font-weight: bold;
    color: white;
    font-size: 2rem;
    text-align: left;
    margin-bottom: 2rem;
  }

  .logo {
    width: 8rem;
    align-self: center;
    margin-bottom: 2rem;
  }

  .note {
    margin-bottom: 3rem;
  }
`;

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { signup: false };
  }

  render() {
    return (
      <LoginContainer>
        <Login signup={this.state.signup}>
          <div className="logo-mobile">
            <header>
              <img className="logo" src={logo} />
              {/* Ideable */}
            </header>
            <div>Organize yourself, at the speed of thought!</div>
          </div>
          <div className="container">
            <div className="label username">Username</div>
            <input type="text" className="username" />

            <div className="label">Email</div>
            <input type="email" />

            <div className="label">Password</div>
            <input type="password" />

            <div className="button">
              {this.state.signup ? "Sign Up" : "Login"}
            </div>
          </div>
          <div className="signup-message">
            {this.state.signup
              ? "Already have an account? "
              : "Don't have an account yet? "}
            <span onClick={() => this.setState({ signup: !this.state.signup })}>
              {this.state.signup ? "Login" : "Sign Up"}
            </span>
          </div>
        </Login>
        <Landing>
          <div></div>
          <Note>
            <div className="title">DASHBOARD</div>
            <img className="logo" src={logo} />
            <div className="note">{JSON.stringify(this.props.user)}</div>
          </Note>
          <div></div>
        </Landing>
      </LoginContainer>
    );
  }
}
