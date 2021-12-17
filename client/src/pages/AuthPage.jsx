import React, { useState } from "react";
import axios from "axios";

const AuthPage = ({ setUser }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState("password");

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// /user/login
		axios
			.post("/user/login", {
				email: email,
				password: password,
			})
			.then((res) => {
				setUser(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handlePasswordVisible = (e) => {
		e.preventDefault();
		setPasswordVisible(passwordVisible === "text" ? "password" : "text");
	};

	return (
		<>
			<form>
				<input
					type="email"
					name="email"
					placeholder="Enter email"
					value={email}
					onChange={handleEmailChange}
				/>
				<input
					type={passwordVisible}
					placeholder="Enter password"
					value={password}
					onChange={handlePasswordChange}
				/>
				<button type="submit" onClick={handleSubmit}>
					Login
				</button>

				<button onClick={handlePasswordVisible}>Show Password</button>
			</form>
			<div>ERROR!</div>
		</>
	);
};

export default AuthPage;
