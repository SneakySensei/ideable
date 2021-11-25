import React, { useState } from "react";
import axios from "axios";

const AuthPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState("password");

	return (
		<>
			<form>
				<input
					type="email"
					placeholder="Enter email"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<input
					type={passwordVisible}
					placeholder="Enter password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<button
					type="submit"
					onClick={(e) => {
						e.preventDefault();
						// /user/login
						axios
							.post("/user/login", {
								email: email,
								password: password,
							})
							.then((res) => {
								console.log(res);
							})
							.catch((err) => {
								console.log(err);
							});
					}}
				>
					Login
				</button>

				<button
					onClick={(e) => {
						e.preventDefault();
						setPasswordVisible(
							passwordVisible === "text" ? "password" : "text"
						);
					}}
				>
					Show Password
				</button>
			</form>
			<div>ERROR!</div>
		</>
	);
};

export default AuthPage;
