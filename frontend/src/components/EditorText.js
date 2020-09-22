import React from "react";
import styled from "styled-components";
import ContentEditable from "react-contenteditable";
import axios from "axios";

import colors from "../assets/colors.json";

const EditorContainer = styled.div`
  position: absolute;
  background-color: #0008;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  z-index: 10;

  .modal {
    width: 40vw;
    height: 80vh;
    background-color: ${colors.foreground};
    border-radius: 0.5rem;
    overflow: hidden;
    display: flex;
    border: 0.2rem solid ${colors.foreground};
    flex-direction: column;
    animation: slide-up 0.5s ease;

    @media (max-width: 768px) {
      width: 95%;
      height: 80%;
    }

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

    .blade {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      svg {
        height: 1.8rem;
        transition: color 0.3s ease;

        &:hover {
          color: ${colors.blue};
        }
      }
      .color {
        .radio {
          display: inline-block;
          border-radius: 4rem;
          margin: 0 0.1rem;
          border: 0.2rem solid ${colors.text};

          &.c0 {
            border-color: ${colors.text};
          }
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
        }
        input {
          margin: 0.19rem 0.19rem 0 0.19rem;
          height: 1.2rem;
          width: 1.2rem;
        }
      }
    }

    .title {
      font-size: 13pt;
      margin: 0.75rem 1rem;
      outline-style: none;
      color: white;
      font-weight: bold;
      border: none;
      background-image: none;
      background-color: transparent;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      border-bottom: 1px solid white;
    }

    .content {
      outline: none;
      flex: 1;
      margin: 0 1rem;
      margin-bottom: 1rem;
      overflow-y: scroll;
      color: ${colors.text};

      &::-webkit-scrollbar {
        width: 0.5rem;
      }

      &::-webkit-scrollbar {
        width: 0.5rem;
      }

      &::-webkit-scrollbar-track {
        background: ${colors.foreground};
        border-radius: 0.25rem;
      }

      &::-webkit-scrollbar-thumb {
        background: ${colors.blue};
        border-radius: 0.25rem;
      }

      -webkit-scrollbar-thumb:hover {
        background: #b30000;
      }
    }
  }
`;

export default class EditorText extends React.Component {
  constructor(props) {
    super(props);

    this.contentEditable = React.createRef();
    this.state = {
      note: this.props.note,
      html: "<i>Start typing your note here....</i>",
      title: "",
      color: 0,
    };
    this.handleChangeData = this.handleChangeData.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleKeyDown(event) {
    if (event.key === "Enter" && event.ctrlKey) {
      this.handleUpdate(event);
    }
  }

  handleUpdate(e) {
    e.stopPropagation();
    console.log("Note Updated");
    if (this.state.html === "") {
      this.props.handleClose();
      return;
    }
    var payload = {};
    payload.color = this.state.color;
    payload.title = this.state.title;
    payload.value = this.state.html;

    if (this.props.note) {
      axios
        .patch(`/notes/${this.state.note._id}`, payload, {
          headers: { token: this.props.token },
        })
        .then((response) => {
          this.props.refresh(response.data);
          this.props.handleClose();
        })
        .catch((error) => {
          console.log(error);

          localStorage.removeItem("user");
          this.props.refresh();
        });
    } else {
      axios
        .post("/notes/add", payload, {
          headers: { token: this.props.token },
        })
        .then((response) => {
          this.props.refresh(response.data);
          this.props.handleClose();
        })
        .catch((error) => {
          console.log(error);

          localStorage.removeItem("user");
          this.props.refresh();
        });
    }
  }

  handleChangeData = (evt) => {
    this.setState({ html: evt.target.value });
  };

  handleChangeTitle = (evt) => {
    this.setState({ title: evt.target.value });
  };

  handleColorChange = (evt) => {
    evt.stopPropagation();
    console.log(evt.target.value);
    this.setState({
      color: parseInt(evt.target.value),
    });
  };

  componentDidMount() {
    this.setState({
      note: this.props.note,
    });

    if (this.props.note) {
      this.setState({
        html: this.props.note.data,
        title: this.props.note.title,
        color: this.props.note.color,
      });
    }
  }

  handleFocus(evt) {
    if (this.state.html === "<i>Start typing your note here....</i>") {
      this.setState({ html: "" });
    }
  }

  render() {
    return (
      <EditorContainer className={this.props.className}>
        <div className={"modal" + " c" + this.state.color}>
          <div className="blade">
            <svg
              onClick={this.props.handleClose}
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
                d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
              />
            </svg>
            <div className="color">
              <div className="radio c0">
                <input
                  type="radio"
                  id="c0"
                  name="colorSelect"
                  value="0"
                  checked={this.state.color === 0}
                  onChange={this.handleColorChange}
                />
              </div>
              <div className="radio c1">
                <input
                  type="radio"
                  id="c1"
                  name="colorSelect"
                  value="1"
                  checked={this.state.color === 1}
                  onChange={this.handleColorChange}
                />
              </div>
              <div className="radio c2">
                <input
                  type="radio"
                  id="c2"
                  name="colorSelect"
                  value="2"
                  checked={this.state.color === 2}
                  onChange={this.handleColorChange}
                />
              </div>
              <div className="radio c3">
                <input
                  type="radio"
                  id="c3"
                  name="colorSelect"
                  value="3"
                  checked={this.state.color === 3}
                  onChange={this.handleColorChange}
                />
              </div>
              <div className="radio c4">
                <input
                  type="radio"
                  id="c4"
                  name="colorSelect"
                  value="4"
                  checked={this.state.color === 4}
                  onChange={this.handleColorChange}
                />
              </div>
              <div className="radio c5">
                <input
                  type="radio"
                  id="c5"
                  name="colorSelect"
                  value="5"
                  checked={this.state.color === 5}
                  onChange={this.handleColorChange}
                />
              </div>
              <div className="radio c6">
                <input
                  type="radio"
                  id="c6"
                  name="colorSelect"
                  value="6"
                  checked={this.state.color === 6}
                  onChange={this.handleColorChange}
                />
              </div>
            </div>
            <svg
              onClick={this.handleUpdate}
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            name="title"
            value={this.state.title}
            onChange={this.handleChangeTitle}
            className="title"
            placeholder="Add Title"
          />
          <ContentEditable
            onFocus={this.handleFocus}
            className="content"
            onKeyDown={this.handleKeyDown}
            innerRef={this.contentEditable}
            html={this.state.html} // innerHTML of the editable div
            disabled={false} // use true to disable editing
            onChange={this.handleChangeData} // handle innerHTML change
            tagName="article" // Use a custom HTML tag (uses a div by default)
          />
        </div>
      </EditorContainer>
    );
  }
}
