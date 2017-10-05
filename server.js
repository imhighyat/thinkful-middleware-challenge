const express = require('express');
// you'll need to use `queryString` in your `gateKeeper` middleware function
const queryString = require('query-string');


const app = express();

// For this challenge, we're hard coding a list of users, because
// we haven't learned about databases yet. Normally, you'd store
// user data in a database, and query the database to find
// a particular user.
//
// ALSO, for this challenge, we're storing user passwords as
// plain text. This is something you should NEVER EVER EVER 
// do in a real app. Instead, always use cryptographic
// password hashing best practices (aka, the tried and true
// ways to keep user passwords as secure as possible).
// You can learn more about password hashing later
// here: https://crackstation.net/hashing-security.htm
const USERS = [
  {id: 1,
   firstName: 'Joe',
   lastName: 'Schmoe',
   userName: 'joeschmoe@business.com',
   position: 'Sr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 2,
   firstName: 'Sally',
   lastName: 'Student',
   userName: 'sallystudent@business.com',
   position: 'Jr. Engineer',
   isAdmin: true,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 3,
   firstName: 'Lila',
   lastName: 'LeMonde',
   userName: 'lila@business.com',
   position: 'Growth Hacker',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  },
  {id: 4,
   firstName: 'Freddy',
   lastName: 'Fun',
   userName: 'freddy@business.com',
   position: 'Community Manager',
   isAdmin: false,
   // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
   password: 'password'
  }
];

//middleware that will be called whenever we use the app
app.use(gateKeeper);

//middleware that will check if user has valid credentials
function gateKeeper(req, res, next) {
  //gets the x-username-and-password from the request header, parses it to be an object and stores in 'userpwdata'
  var userpwdata = queryString.parse(req.get('x-username-and-password'));
  //loops through the USERS array using find and stores the first matching value in  'result'
  var result = USERS.find((user, index) => {
    //tests if user and password from 'USERS' array matches the user and pw values from 'userpwdata'
    //returns the matching value if true and undefined if false
    return user.userName === userpwdata.user && user.password === userpwdata.pass;
  });
  //assigns the value of 'result' to 'req.user'
  req.user = result;
  //calls on the next middleware (if there are any more or the end route of the request)
  next();
}

//GET request handler
app.get("/api/users/me", (req, res) => {
  // send an error message if no or wrong credentials sent
  if (req.user === undefined) {
    return res.status(403).json({message: 'Must supply valid user credentials'});
  }
//stores firstName, lastName, id, userName, position from req.user using an object deconstruction
  const {firstName, lastName, id, userName, position} = req.user;
  //return a json response with the deconstructed object above
  return res.json({firstName, lastName, id, userName, position});
});

app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});
