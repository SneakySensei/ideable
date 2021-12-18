export const loginUser = (data) => {
	return {
		type: "USER_LOGIN",
		payload: data,
	};
};

export const logoutUser = () => {
	return {
		type: "USER_LOGOUT",
	};
};
