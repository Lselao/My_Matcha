module.exports = (req, res, next) =>{
	if (!req.session.isLoggedIn)
		return res.send('eror');
	return next();
}