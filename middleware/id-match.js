//check if logged in user id matches

module.exports = async function (req, res, next) {
    const { userId } = req.body;

    if (req.user.id == userId) {
        next()
    } else {
        return next(new Error("Invalid request! User IDs do not match."));
    }
  };