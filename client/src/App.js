import { useState } from "react";
import { createGlobalStyle } from "styled-components";
import AuthPage from "./pages/AuthPage";
import Notes from "./pages/Notes";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    box-sizing: border-box;
  }
`;

const App = () => {
	const user = useSelector((state) => state.user);

	console.log(user);

	return (
		<Router>
			<GlobalStyles />
			<Switch>
				<Route path="/login">
					<AuthPage />
				</Route>

				<Route path="/">
					<Notes />
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
