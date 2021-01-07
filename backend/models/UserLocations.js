const { getDb } = require('../helpers/databas');
const AllLocations = require('./AllLocations');

// For users
class UserLocations {	
	constructor(
		coords,
		userLocation,
		userId
	) {
		this.coords = coords;
		this.userLocation = userLocation;
		this.userId = userId;
	}

	save() {
		let newUser = true;
		UserLocations.fetchAll().then((location) => {
			location.forEach(loc => {
				if (loc.userId === this.userId) {
					newUser = false;
				}
			});
			if (newUser === true) {
				AllLocations.findByField(this.userLocation).then(result => {
					// check if user has location
					// else update
					const db = getDb();
					return new Promise((res, reject) => {
						db.query('INSERT INTO UserLocations(userId, locationId, userLatitude, userLongitude) VALUES(?, ?, ?, ?)'
							, [this.userId, result[0].id, this.coords.lat, this.coords.long], (err) => {
								if (err) {
									reject(err);
								}
								res(this);
							});
					});
				})
			} else {
				this.update(location.id)
				// update
			}
		})
	}

	 update(locationId) {
		const db = getDb();
		return new Promise((res, reject) => {
			return db.query(`UPDATE UserLocations SET locationId = ?, userLatLon = ? WHERE userId=${this.userId}`, [locationId, JSON.stringify(this.coords)], (err) => {
				if (err)
					reject(err);
			});
		});
	}

	static async getSameLocation(userId){
		let userLocation;
		const fullProfiles = [];
		const users = [];
		const allLocations = await this.fetchAll();
		allLocations.map(location => {
			if (location.userId === userId) {
				userLocation = location.locationId
			}
		});
		allLocations.forEach(location => {
			if (location.locationId === userLocation && userId !== location.userId) {
				users.push(location)
			}
		})
		await Promise.all(users.map(async user => {
			// eslint-disable-next-line global-require
			const User = require('./users');
			const foundUser = await User.findById(user.userId);
			fullProfiles.push(foundUser)
		}))
		return (fullProfiles);
	}

	static updateUserLocationByUserId(locationId, userId) {
		const db = getDb();
		return new Promise((res, reject) => {
			return db.query(`UPDATE UserLocations SET locationId = ? WHERE userId=${userId}`, [locationId], (err, results) => {
				if (err)
					reject(err);
				res(results);
			});
		});
	}


	// Specific to Location table
	static findByLocationId(userId) {
		const db = getDb();
		return new Promise((res) => {
			db.query(`SELECT UserLocations FROM Users where userId=${userId}`, (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static DeleteProfile(userId) {
		const db = getDb();
		return new Promise((res) => {
			db.query(`DELETE FROM UserLocations WHERE userId=${userId}`, (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static fetchAll() {
		const db = getDb();
		return new Promise((res) => {
			db.query('SELECT * FROM UserLocations', (err, results) => {
				if (err) {
					throw (new Error(err));
				}
				res(results);
			});

		});
	}

	static async postLocation(userId, rt, locationReal) {
		let hasLocation = false;
		let userLocation;
		let locationId;

		rt.data.results[1].address_components.map((elementresult) => {
			if (hasLocation === true)
				return
			elementresult.types.map((element) => {
				if (hasLocation === false && (element.includes('sublocality_level_1') || element.includes('administrative_area_level_2') || element.includes('locality'))) {
					hasLocation = true;
				}
				if (hasLocation === true) {
					userLocation = elementresult
				}
			});
		})
		try {
			if (userLocation) {
				const newLocation = new AllLocations(
					userLocation.long_name
				);
				locationId = await newLocation.save()
			}
			const userCurrentLocation = new UserLocations(
				locationReal,
				userLocation.long_name,
				userId
			)
			await userCurrentLocation.save();
			return {id:locationId, locationName: userLocation.long_name }
		}
		catch (err) {
			throw new Error(err)
		}
	}
}

module.exports = UserLocations;
