import bcrypt from 'bcrypt';
import express from 'express';
import jwt from "jsonwebtoken";
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
    });
});

//** POST [ host/api/user/login ] **//
usersRouter.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      };
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      };
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "Secret_Seed",
        { expiresIn: "4h" }
      );
      res.status(200).json({
        token: token
      })
    })
    .catch (err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

export default usersRouter;