const User = require('../models/users');
const {getMatches, getSearch} = require('../helpers/Match');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.fetchFullProfiles();
    res.status(200).json(users);
  }
  catch (err) {
    res.status(400).json({ message: err.message, success: false })
  }
}

exports.getMatches = async (req, res) => {
  const { userId } = req.params;
  try {
  const matchedUsers = await getMatches(userId)
  res.status(200).json(matchedUsers);
}
  catch (err) {
  res.status(400).json({ message: err.message, success: false })
}
}

exports.searchUsers = async (req, res) => {
  const { userId, options } = req.body;
  let searchResults
  try {
    if (options.quickSearch !== '')
     searchResults = await getSearch(options.quickSearch, userId)
    else if (options)
      searchResults = await getSearch(options.name, userId, options)
    res.status(200).json(searchResults);
  }
  catch (err) {
    res.status(400);
  }
}

exports.getUser = async (req, res) => {
  let visitedUser = {};
  try {
    visitedUser = await User.findById(req.params.id)
    res.status(200).json(visitedUser);
  }
  catch (err) {
    res.status(400).json({ message: err.message, success: false })
  }
}
