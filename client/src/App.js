import { createGlobalStyle } from "styled-components";
import AuthPage from "./pages/AuthPage";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    box-sizing: border-box;
  }
`;

const App = () => {
	return (
		<>
			<GlobalStyles />
			<AuthPage />
		</>
	);
};

export default App;

export const time = "12:00AM";
