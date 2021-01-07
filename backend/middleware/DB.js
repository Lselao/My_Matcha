
const { startConnection } = require('../helpers/databas');

const dbInit = (req, res, next) => {
	startConnection();
	next();
}
exports.dbInit= dbInit;
