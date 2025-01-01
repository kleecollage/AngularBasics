import bcrypt from 'bcrypt';
import express from 'express';
import { User } from '../models/user.js';

const usersRouter = express.Router();

//** POST [ host/api/user/signup ] **//
usersRouter.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User Created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    })


});


export default usersRouter;