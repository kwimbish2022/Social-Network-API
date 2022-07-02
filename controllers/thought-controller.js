const { user, thought } = require('../models');

const thoughtController = {
    // all the thoughts
    getAllThought(req, res) {
        thought.find({})
          .populate({
            path: 'reactions',
            select: '-__v'
          })
          .select('-__v')
          .sort({ _id: -1 })
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
    },
    // one thought/id
    getThoughtById({ params }, res) {
        thought.findOne({ _id: params.id })
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thoughts with that id' });
                return;
            }
            res.json(dbThoughtData);    
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    //create
    createThought({ body }, res) {
        thought.create(body)
        .then(({ _id }) => {
            return user.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id }},
                { new: true }
            );
        })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No user found with that id'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
    // update the thought/id
    updateThought({ params, body }, res) {
        thought.findOneAndUpdate({_id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought with that id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },
    // delete thought/id
    deleteThought({ params }, res) {
        thought.findOneAndDelete({ _id: params.id })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought with that id'});
                return;
            }
            return user.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { thoughts: params.Id }},
                { new: true }
            )
          })
          .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with that id' });
                return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },
    // react
    createReaction({ params, body }, res) {
        thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: {reactions: body}},
            {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought with that id'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    },
    //delete it!
    deleteReaction({ params }, res) {
        thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId }}},
            { new: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'Nuh-uh'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;