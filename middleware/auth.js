const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	const token = req.header("token");
	if (!token) return res.status(401).json({ message: "Auth Error" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded.user;
		next();
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Invalid Token" });
	}
};
