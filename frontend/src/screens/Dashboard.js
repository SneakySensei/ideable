import React from "react";
import styled from "styled-components";
import Masonry from "react-masonry-css";

import colors from "../assets/colors.json";
import logo from "../assets/ideable.svg";
import profile from "../assets/profile.svg";

import Note from "../components/Note";
import axios from "axios";

const DashboardContainer = styled.div`
  background-color: ${colors.background};
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;

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

    .profile {
      height: 2rem;
      margin: 0.75rem 2rem 0.75rem 0;
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
    this.state = { user: this.props.user, notes: [], filteredNotes: [] };

    this.refresh = this.refresh.bind(this);
  }

  refresh(notes) {
    this.setState({ notes: notes });
    this.props.refresh();
  }

  componentDidMount() {
    axios
      .get("/notes/list", { headers: { token: this.state.user.token } })
      .then((response) => {
        this.setState({ notes: response.data, filteredNotes: response.data });
        this.props.refresh();
      })
      .catch((error) => {
        if (error.response.data.message === "Invalid Token") {
          localStorage.removeItem("user");
          this.props.refresh();
        }
      })
      .finally(() => {
        console.log(this.state.notes);
      });
  }

  render() {
    return (
      <DashboardContainer>
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
            <input placeholder="Search" type="text" name="search" />
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
          <img src={profile} className="profile" />
        </nav>
        <NotesContainer>
          <Masonry
            breakpointCols={{ default: 4, 992: 3, 768: 2, 576: 1 }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {this.state.notes.map((note, index) => (
              <Note
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
