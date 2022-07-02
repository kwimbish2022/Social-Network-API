const { user, thought } = require('../models');

const userController = {
    //get all
    getAllUser(req, res) {
        user.find({})
          .select('-__v')
          .sort({ _id: -1 })
          .then(dbUserData => res.json(dbUserData))
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
    },
    // get one/id
    getUserById({ params }, res) {
        user.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user with that id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    //create one
    createUser({ body }, res) {
        user.create(body)
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
    },
    // update user/id
    updateUser({ params, body }, res) {
        user.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404)/json({ message: 'No user with that id'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    // delete user/thoughts
    deleteUser({ params }, res) {
        thought.deleteMany({ userId: params.id })
         .then(() => {
            user.findOneAndDelete({ userId: params.id })
              .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with that id'});
                    return;
                }
                res.json(dbUserData);
              });
         })
         .catch(err => res.json(err));
    },
    // add friend
    addFriend({ params }, res) {
        user.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId }},
            { new: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user with that id'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },
    // bye Felicia
    deleteFriend({ params }, res) {
        user.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId }},
            { new: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with that id'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    }
};

module.exports = userController;