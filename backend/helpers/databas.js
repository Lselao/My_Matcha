const mysql = require('mysql');

const config = require('config');

const host = config.get('sqlURI');
const loginDetails = config.get('sqlCredentials')

let pool;

const startConnection = () => {
	if (!pool) {
		pool = mysql.createPool({
			host,
			user: loginDetails.user,
			password: loginDetails.password,
			database: loginDetails.database,
			multipleStatements: true
		});
}
	// throw new Error('pool already exists');
}

const SqlConnect = (callback) => {
	startConnection();
	pool.getConnection((err, connection) => {
		if (!err) {
			callback();
		} else {
			throw new Error(err)
		}
		connection.release();
	});
};



const getDb = () => {
	if (pool) {
		return pool;
	}
		try {
			SqlConnect(()=>console.log('reconnected'));
			return pool;
		}
		catch (err) {
			throw new Error(err);
		}
}
exports.SqlConnect = SqlConnect;
exports.getDb = getDb;
exports.startConnection = startConnection;
