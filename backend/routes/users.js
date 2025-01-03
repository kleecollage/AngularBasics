import express from 'express';
import { createUser, loginUser } from '../controllers/user.js';

const usersRouter = express.Router();

//** POST [ host/api/user/signup ] **//
usersRouter.post("/signup", createUser);

//** POST [ host/api/user/login ] **//
usersRouter.post("/login", loginUser);


export default usersRouter;