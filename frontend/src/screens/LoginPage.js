import React from "react";
import styled from "styled-components";
import axios from "axios";
import SimpleReactValidator from "simple-react-validator";

import colors from "../assets/colors.json";
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

    .message {
      margin-top: 1rem;
      padding: 0.5rem;
      color: #dc3545 !important;
      background-color: ${colors.background};
      border: 1px solid ${colors.textgrey};
      border-radius: 0.2rem;
    }
    .button {
      margin-top: 2rem;
      background-color: ${colors.blue};
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      text-align: center;
      color: white;
      outline: none;
      font-size: inherit;
      font-weight: inherit;
      font-family: inherit;

      &:disabled {
        filter: brightness(0.5);
      }
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

    .text-danger {
      color: #dc3545 !important;
      margin-left: 0.5rem;
      margin-top: 0.2rem;
      font-size: 0.9rem;
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

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signup: false,
      processing: false,
      username: "",
      email: "",
      password: "",
      message: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.validator = new SimpleReactValidator();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    this.setState({ message: "" });
    if (
      this.validator.fieldValid("email") &&
      this.validator.fieldValid("password") &&
      (!this.state.signup || this.validator.fieldValid("username"))
    ) {
      this.setState({ processing: true });

      const endpoint = "/user/" + (this.state.signup ? "signup" : "login");

      axios
        .post(endpoint, {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
        })
        .then((response) => {
          if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log(response.data);
          }
          this.props.refresh();
        })
        .catch((error) => {
          this.setState({ message: error.response.data.message });
          this.setState({ processing: false });
        });
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
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
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
              className="username"
            />
            {this.validator.message(
              "username",
              this.state.username,
              "required",
              { className: "text-danger username" }
            )}

            <div className="label">Email</div>
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleInputChange}
            />
            {this.validator.message(
              "email",
              this.state.email,
              "required|email",
              { className: "text-danger" }
            )}

            <div className="label">Password</div>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
            {this.validator.message(
              "password",
              this.state.password,
              "required|min:6",
              { className: "text-danger" }
            )}

            <button
              className="button"
              onClick={this.handleSubmit}
              disabled={this.state.processing}
            >
              {this.state.processing
                ? "Please wait..."
                : this.state.signup
                ? "Sign Up"
                : "Login"}
            </button>
            {this.state.message && (
              <div className="message">{this.state.message}</div>
            )}
          </div>
          <div className="signup-message">
            {this.state.signup
              ? "Already have an account? "
              : "Don't have an account yet? "}
            <span
              onClick={() =>
                this.setState({ signup: !this.state.signup, username: "" })
              }
            >
              {this.state.signup ? "Login" : "Sign Up"}
            </span>
          </div>
        </Login>
        <Landing>
          <div></div>
          <Note>
            <div className="title">Ideable</div>
            <img className="logo" src={logo} />
            <div className="note">
              Organize yourself, at the speed of thought!
            </div>
          </Note>
          <div></div>
        </Landing>
      </LoginContainer>
    );
  }
}
