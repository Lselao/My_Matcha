// const sgMail = require('@sendgrid/mail');
const { getDb } = require('../helpers/databas');

class AllLocations {
	constructor(
		location
	) {
		this.location = location;
	}



	save() {
		this.checkIfLocationExists().then(isNewLocation => {
			if (isNewLocation) {
				const db = getDb();
				return new Promise((res, reject) => {
					db.query('INSERT INTO AllLocations(locationName) VALUES(?)'
						, [this.location], (err) => {
							if (err) {
								reject(err);
							}
							res(this);
						});
				});
			}
		})
	}
	
	static fetchAll() {
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM AllLocations', (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	async checkIfLocationExists() {
		let newLocation = true;
		const allLocations = await AllLocations.fetchAll();
		allLocations.map(res => {
			if (this.location === res.locationName) {
				newLocation = false
			}
		});
		return newLocation;
	}


	// Specific to Location table
	static update(userId, data) {
		const db = getDb();
		return new Promise((res, reject) => {
			if (!data) {
				return;
			}
			Object.keys(data).map((field) => {
				return db.query(`UPDATE Users SET ${field}=? WHERE userId=${userId}`, [data[field]], (err) => {
					if (err)
						reject(err);
				});
			});
			res('updated');
		});
	}

	static findByUserId(userId) {
		const db = getDb();
		return new Promise((res) => {
			db.query(`SELECT locationName FROM Users where userId=${userId}`, (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static findByField(data) {
		const db = getDb();
		return new Promise((res, reject) => {
			db.query('SELECT * FROM AllLocations WHERE locationName=?', [data], (err, results) => {
				if (err) {
					reject(err);
				}
				res(results);
			});

		});
	}


	static findByLocationId(locationId) {
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM AllLocations WHERE id=?', [locationId], (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				return res(results[0]);
			});

		});
	}
}

module.exports = AllLocations;
