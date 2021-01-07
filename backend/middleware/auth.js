const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
	const token = req.header('x-auth-token');

	// Check for token
	if (!token) return res.status(401).json( 'No token, authorization denied');

	try {
		// Verify Token
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		// Add user from payload
		req.user = decoded;
		return next();
	} catch (e) {
		return res.status(400).json('Token is not valid');
	}
}

module.exports = auth;