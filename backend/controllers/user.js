import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { User } from '../models/user.js';

export const createUser = (req, res, next) => {
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
          message: 'Oops. Somethig went wrong. Try again later'
        });
      });
  });
}

export const loginUser = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user)
        return res.status(401).json({ message: "Invalid Authenticaton Credentials" });

      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ message: "Invalid Authenticaton Credentials" });

      // TOKEN //
      const token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_KEY,
        { expiresIn: "4h" }
      );

      return res.status(200).json({
        token: token,
        expiresIn: 3600 * 4,
        userId: user._id
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Oops. An error occurred" });
    }
}