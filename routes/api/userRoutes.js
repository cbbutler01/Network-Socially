const router = require('express').Router();
const {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
  } = require('../../controllers/userControl');

  router.route('/')
  .get(getAllUsers)
  .post(createUser);

  router.route('/:_id')
  .get(getOneUser)
  .put(updateUser)
  .delete(deleteUser);

  router.route('/:_id/friends/:friendId')
  .post(addFriend)
  .delete(deleteFriend);

  module.exports = router;
