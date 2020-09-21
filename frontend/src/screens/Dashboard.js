import React from "react";
import styled from "styled-components";
import Masonry from "react-masonry-css";
import axios from "axios";

import colors from "../assets/colors.json";
import logo from "../assets/ideable.svg";
import profile from "../assets/profile.svg";

import Note from "../components/Note";
import EditorText from "../components/EditorText";

const DashboardContainer = styled.div`
  background-color: ${colors.background};
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .add-button {
    position: absolute;
    z-index: 5;
    right: 1rem;
    bottom: 0.75rem;

    svg {
      width: 4rem;
      color: white;
      border-radius: 5rem;
      background-color: ${colors.blue};
      transition: background 0.3s ease;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      animation: slide-up 0.4s ease;

      &:hover {
        filter: brightness(1.2);
      }
      &:active {
        filter: brightness(1);
        opacity: 0.8;
      }
    }
  }

  .editor {
    display: none;

    &.active {
      display: grid;
    }
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;

    @media (max-width: 768px) {
      margin-bottom: 0;
    }

    .logo {
      color: ${colors.text};
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 1.5rem;

      img {
        height: 2rem;
        margin: 0.75rem 0.5rem 0.75rem 2rem;
      }
    }

    .search {
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      margin: 0 0.75rem;
      border-radius: 1.5rem;
      overflow: hidden;
      background-color: ${colors.foreground};

      svg {
        height: 1.5rem;
        margin: 0 1rem;
        color: ${colors.text};
      }

      @media (max-width: 768px) {
        order: 1;
        flex-basis: 100%;
        margin-bottom: 0.75rem;
      }

      input {
        outline: none;
        flex: 1;
        height: 2.5rem;
        border-style: none;
        background-color: ${colors.foreground};
        color: ${colors.textgrey};
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;

        &:focus {
          color: ${colors.text};
        }
      }
    }

    .profile-dropdown {
      position: relative;
      display: inline-block;
    }

    .profile {
      height: 2rem;
      margin: 0.75rem 2rem 0.75rem 0;
      cursor: pointer;
    }

    .profile-big {
      height: 3rem;
    }

    .dropdown-content {
      /* display: none; */
      position: absolute;
      background-color: ${colors.foreground};
      border-radius: 0.5rem;
      padding: 1rem 0;
      min-width: 15rem;
      overflow: auto;
      right: 0;
      margin: 0 1rem;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      div {
        margin-top: 0.75rem;
      }

      .email {
        color: ${colors.textgrey};
      }

      .username {
        color: ${colors.text};
        font-weight: bold;
      }

      .logout {
        padding: 0.75rem 1rem;
        background-color: #dc3545;
        border-radius: 5rem;
        cursor: pointer;

        &:hover {
          filter: brightness(1.2);
        }

        &:active {
          filter: brightness(1);
          opacity: 0.8;
        }
      }

      &.active {
        display: flex;
      }
    }
  }
`;

const NotesContainer = styled.div`
  flex: 1;
  flex-direction: column;
  overflow-y: scroll;
  padding: 0 1rem 0 0;

  .my-masonry-grid {
    display: -webkit-box; /* Not needed if autoprefixing */
    display: -ms-flexbox; /* Not needed if autoprefixing */
    display: flex;
    align-self: stretch;
    margin-left: -1rem; /* gutter size offset */
    width: auto;
    max-width: 1200px;
    margin: 0 auto;
  }

  .my-masonry-grid_column {
    padding-left: 1rem; /* gutter size */
    background-clip: padding-box;
    flex: 1;
  }

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
`;

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      isDropdownOpen: false,
      notes: [],
      filteredNotes: [],
      filter: "",
      editorText: false,
      activeNote: undefined,
    };

    this.refresh = this.refresh.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleOpenEditor = this.handleOpenEditor.bind(this);
  }

  refresh(notes) {
    var filteredNotes = notes.sort((a, b) => {
      return a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1;
    });

    this.setState({ notes: notes, filteredNotes: filteredNotes, filter: "" });
    this.props.refresh();
  }

  handleSearch(event, notes) {
    this.setState({ filter: event.target.value });
    const lowercaseFilter = event.target.value.toLowerCase();
    var sorted = notes.sort((a, b) => {
      return a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1;
    });

    this.setState({
      filteredNotes: sorted.filter((item) => {
        return (
          item["title"].toLowerCase().includes(lowercaseFilter) ||
          item["data"].toLowerCase().includes(lowercaseFilter)
        );
      }),
    });
  }

  componentDidMount() {
    console.log(this.state.user);
    axios
      .get("/notes/list", { headers: { token: this.state.user.token } })
      .then((response) => {
        var filteredNotes = response.data.sort((a, b) => {
          return a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1;
        });
        this.setState({ notes: response.data, filteredNotes: filteredNotes });
        this.props.refresh();
      })
      .catch((error) => {
        if (error.response.data.message === "Invalid Token") {
          localStorage.removeItem("user");
          this.props.refresh();
        }
      })
      .finally(() => {
        console.log(this.state.filteredNotes);
      });
  }

  handleColorSearch(event) {
    console.log(event.target.value);
  }

  handleCloseEditor() {
    this.setState({ editorText: false, activeNote: undefined });
  }

  handleOpenEditor(note) {
    this.setState({ editorText: true, activeNote: note });
  }

  render() {
    return (
      <DashboardContainer>
        {this.state.notes.length !== 0 && (
          <div className="add-button">
            <svg
              onClick={() => {
                this.handleOpenEditor(undefined);
              }}
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {this.state.editorText && (
          <EditorText
            className={"editor active"}
            handleClose={this.handleCloseEditor.bind(this)}
            note={this.state.activeNote}
            refresh={this.refresh}
            token={this.state.user.token}
          />
        )}
        <nav>
          <div className="logo">
            <img src={logo} />
            Ideable
          </div>
          <div className="search">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              placeholder="Search"
              type="text"
              name="search"
              onChange={(event) => {
                this.handleSearch(event, this.state.notes);
              }}
              value={this.state.filter}
            />
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div
            className="color-search"
            onChange={this.handleColorSearch.bind(this)}
          >
            <input type="radio" id="c0" name="color" value="c0" />
            <input type="radio" id="c1" name="color" value="c1" />
            <input type="radio" id="c2" name="color" value="c2" />
            <input type="radio" id="c3" name="color" value="c3" />
            <input type="radio" id="c4" name="color" value="c4" />
            <input type="radio" id="c5" name="color" value="c5" />
            <input type="radio" id="c6" name="color" value="c6" />
          </div>
          <div className="profile-dropdown">
            <img
              src={profile}
              className="profile"
              onClick={() => {
                this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
              }}
            />
            <div
              id="profile-dropdown"
              className={
                "dropdown-content" +
                (this.state.isDropdownOpen ? " active" : "")
              }
            >
              <img src={profile} className="profile-big" />
              <div className="username">{this.props.user.details.username}</div>
              <div className="email">{this.props.user.details.email}</div>
              <div
                className="logout"
                onClick={() => {
                  localStorage.removeItem("user");
                  this.props.refresh();
                }}
              >
                Log Out
              </div>
            </div>
          </div>
        </nav>
        <NotesContainer>
          <Masonry
            breakpointCols={{ default: 4, 992: 3, 768: 2, 576: 1 }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {this.state.filteredNotes.map((note, index) => (
              <Note
                handleOpen={(e) => {
                  this.handleOpenEditor(note);
                }}
                key={note._id}
                noteId={note._id}
                color={note.color}
                isPinned={note.isPinned}
                title={note.title}
                type={note.type}
                value={note.data}
                date={note.date}
                refresh={this.refresh}
                token={this.state.user.token}
              />
            ))}
            {/* <Note value="1" />
            <Note value="2" />
            <Note value="3" />
            <Note value="4" />
            <Note value="5" />
            <Note value="6" />
            <Note value="7" />
            <Note value="8" /> */}
          </Masonry>
        </NotesContainer>
      </DashboardContainer>
    );
  }
}
