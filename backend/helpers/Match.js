
const UserLocations = require('../models/UserLocations');
const User = require('../models/users');
const Connections = require('../models/Connections');
const BlockedUsers = require('../models/BlockedUsers');



const checkProfileIsValid = (user) => {
	if (user.pictures.length >= 1 && user.bio !== '' && user.gender && user.sexualPref && !user.resetToken && user.interests.length >= 3) {
		return true;
	}
	return false;
}
const getGendersWanted = (sexualPref, gender) => {
	const gendersWanted = [];
	if (gender === 'Other') {
		gendersWanted.push('Other')
		return gendersWanted;
	}
	if (sexualPref === 'Bisexual') {
		gendersWanted.push('Male', 'Female')
	}
	else if (sexualPref === 'Heterosexual') {
		if (gender === 'Male') {
			gendersWanted.push('Female')
		}
		else {
			gendersWanted.push('Male')
		}
	}
	else if (sexualPref === 'Homosexual') {
		gendersWanted.push(gender);
	}
	return gendersWanted
}

exports.getMatches = async (userId) => {
	const users = await UserLocations.getSameLocation(parseInt(userId));
	const connections = await Connections.findAllContactsByUserId(userId);
	const matchingUser = await User.findById(userId);
	const matchedUsers = [];
	let matchedUserGendersWanted = [];
	let matchedInterests = 0;

	const gendersWanted = getGendersWanted(matchingUser.sexualPref, matchingUser.gender);
	await Promise.all(users.map(async(user) => {
		matchedInterests = 0;
		matchedUserGendersWanted = [];
		const isBlocked = await BlockedUsers.findByUserId(matchingUser.id, user.id)
		const isBlockedBy = await BlockedUsers.findByUserId(user.id, matchingUser.id)
		if (!checkProfileIsValid(user) || isBlocked.length > 0 || matchingUser.id === user.id || isBlockedBy.length > 0) {
			return;
		}
		user.interests.map((userInterest) => {
			const hasMatchingInterests = matchingUser.interests.filter(interest => interest.interestId === userInterest.interestId);
			if (hasMatchingInterests.length > 0) {
				matchedInterests += 1;
			}
		})
		matchedUserGendersWanted = getGendersWanted(user.sexualPref, user.gender)
		const isConnection = connections.filter((connection) => connection.username === user.username)
		if (user.fameRating > matchingUser.fameRating - 1 && user.fameRating < matchingUser.fameRating + 2 && matchedInterests >= 3 && gendersWanted.includes(user.gender) && matchedUserGendersWanted.includes(matchingUser.gender) && isConnection.length === 0) {
				matchedUsers.push(user);
		}
	}))
	return matchedUsers
}

const filterResults = (matchedUsers, matchingUser, options, matchingTagsCount) => {
	const sortingArray = [...matchedUsers];
	let sortedArray = [];
	if (options.sort === 'alphabetical') {
		sortingArray.sort((a, b) => {
			const userA = a.username.toUpperCase();
			const userB = b.username.toUpperCase();
		  
			let comparison = 0;
			if (userA > userB) {
			  comparison = 1;
			} else if (userA < userB) {
			  comparison = -1;
			}
			return comparison;
		})
		sortedArray = [...sortingArray]
	}
	else if (options.sort === 'age') {
		sortingArray.sort((a, b) => {
			const userA = parseInt(a.age);
			const userB = parseInt(b.age);
		  
			let comparison = 0;
			if (userA > userB) {
			  comparison = 1;
			} else if (userA < userB) {
			  comparison = -1;
			}
			return comparison;
		})
		sortedArray = [...sortingArray]
	}
	else if (options.sort === 'fame') {
		sortingArray.sort((a, b) => {
			const userA = parseInt(a.fameRating);
			const userB = parseInt(b.fameRating);
		  
			let comparison = 0;
			if (userA > userB) {
			  comparison = 1;
			} else if (userA < userB) {
			  comparison = -1;
			}
			return comparison;
		})
		sortedArray = [...sortingArray]
	}
	else if (options.sort === 'location') {
		const sortingArray = [...matchedUsers];
		sortingArray.sort((a, b) => {
			const userA =	a.location.locationName.toUpperCase();
			const userB = b.location.locationName.toUpperCase();
		  
			let comparison = 0;
			if (userA > userB) {
			  comparison = 1;
			} else if (userA < userB) {
			  comparison = -1;
			}
			return comparison;
		})
		sortedArray = [...sortingArray]
	}
	else if (options.sort === 'tag') {
		let matchingTags = [];
		if (matchingTagsCount.length === 0) {
			matchedUsers.map((user) => {
				let matchedInterests = 0;
				user.interests.map((userInterest) => {
					const hasMatchingInterests = matchingUser.interests.filter(interest => interest.interestId === userInterest.interestId);
					if (hasMatchingInterests.length > 0) {
						matchedInterests += 1;
					}
				})
				matchingTags[`${user.username}`] = matchedInterests;
			})
			sortedArray = [...sortingArray]
		}
		else {
			matchingTags = matchingTagsCount;
		}
		sortingArray.sort((a, b) => {
			const userA = parseInt(matchingTags[`${a.username}`]);
			const userB = parseInt(matchingTags[`${b.username}`]);
			let comparison = 0;
			if (userA > userB) {
			  comparison = 1;
			} else if (userA < userB) {
			  comparison = -1;
			}
			return comparison;
		})
		sortedArray = [...sortingArray]
	}
	
	if (options.ascDesc === 'desc' && options) {
		sortedArray.reverse();
	}
	return sortedArray;
}

exports.getSearch = async (name, userId, options = null) => {
	let users;
	const matchingUser = await User.findById(userId);
	let matchedUsers = [];
	const matchingTags = [];

	if (options && options.isNearby) {
		users = await UserLocations.getSameLocation(parseInt(userId));
	}
	else {
		users = await User.fetchFullProfiles();
	}
	await Promise.all(users.map(async(user) => {
		let matchedInterests = 0;
		let interestMatch = true;
		let genderMatch = true;
		let sexualPrefMatch = true;
		let fameMatch = true;
		let ageGapMatch = true;
		let nameSearch = true;
		const isBlocked = await BlockedUsers.findByUserId(matchingUser.id, user.id);
		const isBlockedBy = await BlockedUsers.findByUserId(user.id, matchingUser.id)
		if (!checkProfileIsValid(user) || isBlocked.length > 0 || user.id === matchingUser.id || isBlockedBy.length > 0) {
			return;
		}

		if (options) {
			if (options.fameRating) {
				fameMatch = false;
				if (user.fameRating || user.fameRating === 0) {
					if (Math.trunc(parseInt(options.fameRating, 10)) >= Math.trunc(parseInt(user.fameRating, 10))) {
						fameMatch = true
					}
				}

			}
			if (options.matchingInterests) {
				interestMatch = false;
				user.interests.map((userInterest) => {
					const hasMatchingInterests = matchingUser.interests.filter(interest => interest.interestId === userInterest.interestId);
					if (hasMatchingInterests.length > 0) {
						matchedInterests += 1;
					}
				})
				matchingTags[`${user.username}`] = matchedInterests;
				if (parseInt(matchedInterests) >= parseInt(options.matchingInterests)) {
					interestMatch = true
				}
			}
			if (options.gender) {
				genderMatch = false;
				if (user.gender)
					if (options.gender.toString() === user.gender.toString()) {
						genderMatch = true;
					}
			}
			if (options.sexualPref) {
				sexualPrefMatch = false;
				if (user.sexualPref)
					if (options.sexualPref.toString() === user.sexualPref.toString()) {
						sexualPrefMatch = true;
					}
			}
			if (options.ageGap) {
				ageGapMatch = false;
				if (user.age) {
					const ageMax = parseInt(matchingUser.age, 10) + parseInt(options.ageGap, 10);
					const ageMin = matchingUser.age - options.ageGap;
					if ((user.age >= ageMin) && (user.age <= ageMax)) {
						ageGapMatch = true;
					}
				}
			}
			if (options.name) {
				nameSearch = false;
				if ((user.username.includes(name) || user.firstName.includes(name) || user.lastName.includes(name))) {
					nameSearch = true;
				}
			}
			if (fameMatch && ageGapMatch && interestMatch && genderMatch && sexualPrefMatch && nameSearch && userId !== user.id) {
				matchedUsers.push(user);
			}
			if (matchedUsers.length > 0)
				matchedUsers = filterResults(matchedUsers, matchingUser, options, matchingTags);
		}
		else if ((user.username.includes(name) || user.firstName.includes(name) || user.lastName.includes(name))) {
			matchedUsers.push(user);
		}
	}))
	if (!options) {
		matchedUsers.sort((a, b) => {
			const userA = a.username.toUpperCase();
			const userB = b.username.toUpperCase();
		  
			let comparison = 0;
			if (userA > userB) {
				comparison = 1;
			} else if (userA < userB) {
				comparison = -1;
			}
			return comparison;
		});
	}

	return matchedUsers
}

