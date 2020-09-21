import React from "react";
import styled from "styled-components";
import axios from "axios";

import colors from "../assets/colors.json";
import pinOn from "../assets/pin-on.svg";
import pinOff from "../assets/pin-off.svg";

const Note = styled.div`
  background-color: ${colors.foreground};
  border: 0.2rem solid ${colors.foreground};
  color: ${colors.text};
  width: 100%;
  margin-bottom: 1rem;
  padding: 1rem 1rem 0 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1.5px 8px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.2);

  &.c1 {
    border-color: ${colors.blue};
  }
  &.c2 {
    border-color: ${colors.yellow};
  }
  &.c3 {
    border-color: ${colors.white};
  }
  &.c4 {
    border-color: ${colors.magenta};
  }
  &.c5 {
    border-color: ${colors.green};
  }
  &.c6 {
    border-color: ${colors.orange};
  }

  &:hover {
    .blade .delete {
      opacity: 1;
    }

    .blade .pin {
      opacity: 1;
    }
  }

  .title {
    color: white;
    font-size: 13pt;
    padding: 0 0 0.5rem 0;
    font-weight: bold;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  .blade {
    height: 3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .button {
      opacity: 0;
      transition: opacity 0.3s ease;

      @media (max-width: 768px) {
        opacity: 1;
      }
      svg {
        height: 1.5rem;
        transition: color 0.2s ease;
      }

      img {
        height: 1.5rem;
        transition: color 0.2s ease;
      }
    }

    .delete {
      &:hover {
        color: #dc3545;
      }
    }

    .pin:hover {
      filter: brightness(1.5);
    }

    .pinned {
      opacity: 1 !important;
    }
  }
`;

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleDelete = this.handleDelete.bind(this);
    this.handlePin = this.handlePin.bind(this);
  }

  handlePin() {
    console.log("Pinned");
    var payload = {};
    if (this.props.isPinned) {
      payload.isPinned = false;
    } else {
      payload.isPinned = true;
    }
    axios
      .patch(`/notes/${this.props.noteId}`, payload, {
        headers: { token: this.props.token },
      })
      .then((response) => {
        this.props.refresh(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "Invalid Token") {
          localStorage.removeItem("user");
          this.props.refresh();
        }
      });
  }

  handleDelete() {
    axios
      .delete(`/notes/${this.props.noteId}`, {
        headers: { token: this.props.token },
      })
      .then((response) => {
        this.props.refresh(response.data);
      })
      .catch((error) => {
        if (error.response.data.message === "Invalid Token") {
          localStorage.removeItem("user");
          this.props.refresh();
        }
      });
  }

  render() {
    return (
      <Note className={"c" + this.props.color}>
        <div className="title">{this.props.title}</div>
        <div className="message">{this.props.value}</div>
        <div className="blade">
          <div className="delete button" onClick={this.handleDelete}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div
            className={"pin button " + (this.props.isPinned ? "pinned" : "")}
            onClick={this.handlePin}
          >
            <img src={this.props.isPinned ? pinOn : pinOff} />
          </div>
        </div>
      </Note>
    );
  }
}
