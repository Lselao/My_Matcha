
function validate(req) {
  const userData = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
	errors: [],
	empty: {
		type: Boolean,
		default: false
	}
  };
  if (!userData.username || !userData.password || !userData.email || !userData.firstName || !userData.lastName || !userData.age) {
    userData.empty = true;
    return userData;
  }
  if (
    userData.email &&
    !userData.email.match(
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    )
  ) {
    userData.errors.push('Email Address Invalid');
  }
  if (userData.username && !userData.username.match(/^[a-zA-Z0-9]*$/)) {
    userData.errors.push('Username Invalid');
  }
  if (userData.firstName && !userData.firstName.match(/^[a-zA-Z]*$/)) {
    userData.errors.push('First Name Invalid');
  }
  if (userData.lastName && !userData.lastName.match(/^[a-zA-Z]*$/)) {
    userData.errors.push('Last Name Invalid');
  }
  if (
    userData.password &&
    !userData.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
  ) {
    userData.errors.push('Password requires at least a lowercase letter, an uppercase letter, a number and must be 6 characters long');
  }
  if (userData.age < 18){
    userData.errors.push('You must be 18 years or older to register');
  }
  return userData;
}
//   isEmail(req, res, next) {}//might make individual ones later
//   isAlphaNumeric() {}
//   isEmpty = () => {};
//   isLen = () => {};
//   next = () => {};

// module.exports.check = (req, res, next) => {
  // return new Validity(req, res, next);
// };

module.exports = validate;
