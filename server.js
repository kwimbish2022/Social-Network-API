const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3009;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('.'));

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/Social-Network-API',
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// this logs the queries
mongoose.set('debug', true);

app.listen(PORT, () => console.log(`Connected on localhost:${PORT}`));

// notes from tutors, to-dos
//api's for users
// get to get all the users
// get to get a single user, by it's id; while also bringing the thoughts and friend data from that user
// post a new user
//put to update user by id
//delete user by id (extra- also remove their thoughts when delete)
//friend api's
// post to add friend to a user friend list
//delete to remove friend from user friend list
//api's for thoughts
//get to get all thoughts
//get to get a single thought by id
//post to make new thought (push new thought's id to the user's thoughts array field)
//put to update thought by id
//delete a thought by id
//reactions api's
// post tp create reaction (stored in  a single thought's reactions array field)
// delete to pull/remove a reaction by the reaction id value