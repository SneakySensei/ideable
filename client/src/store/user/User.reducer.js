const initialValue = {};

const userReducer = (prevState = initialValue, action) => {
	switch (action.type) {
		case "USER_LOGIN":
			return { ...action.payload };

		case "USER_LOGOUT":
			return {};

		default:
			return prevState;
	}
};

export default userReducer;
