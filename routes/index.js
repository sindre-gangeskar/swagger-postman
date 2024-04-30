var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var users = path.resolve(__dirname, '../data/users.json');

router.get('/', async function (req, res, next) {
  /* Swagger Setup
      #swagger.tags = ['Users']
      #swagger.description = "Gets a list all existing users"
      #swagger.produces = ['text/json']
      #swagger.responses = [200]
  */

  try {
    const rawdata = fs.readFileSync(users);
    const data = JSON.parse(rawdata);
    if (data)
      res.status(200).send(data);
    else res.status(400).send('Cannot read data');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
})

router.post('/', async function (req, res, next) {
  /* Swagger Setup
    #swagger.tags = ['Users']
    #swagger.description = "Create a new user"
    #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
      "schema": {
      $ref: "#/definitions/UserPOST"
      }
    }
    #swagger.responses = [201]
  */

  const rawdata = fs.readFileSync(users);
  let data = JSON.parse(rawdata);
  let dataToAdd = {
    username: req.body.username,
    password: req.body.password,
    score: req.body.score
  };
  let exists = data.users.filter(x => x.username === req.body.username);
  if (exists.length > 0)
    res.status(400).send('User already exists');
  else {
    if (dataToAdd.username !== '' && dataToAdd.password !== '' && typeof dataToAdd.score === 'number') {
      data.users.push(dataToAdd);
      fs.writeFileSync(users, JSON.stringify(data, null, 2));
      res.status(201).send('Successfully created user');
    } else {
      res.status(400).send('All properties must have valid data');
    }
  }
})

router.delete('/', async function (req, res, next) {
  /* Swagger Setup
  #swagger.tags = ['Users']
  #swagger.description = "Delete a user"
  #swagger.parameters['body'] = {
    "name": "body",
    "in": "body",
    "schema": {
      $ref: "#/definitions/UserDELETE"

    }
  }
  #swagger.responses = [204]
*/
  const rawdata = fs.readFileSync(users);
  let data = JSON.parse(rawdata);
  let userToDelete = req.body.username;
  let dataToKeep = data.users.filter(x => x.username !== userToDelete);
  let dataToDelete = data.users.filter(x => x.username === req.body.username);
  
  if (dataToDelete.length === 0)
    res.status(404).send('Cannot find user to delete');
  else {
    data.users = dataToKeep;
    fs.writeFileSync(users, JSON.stringify(data, null, 2));
    res.status(204).send('Successfully deleted user');
  }
})

module.exports = router;
