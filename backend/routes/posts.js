import express from 'express';
import { addPost, deletePost, getAllPosts, getPostById, updatePost } from '../controllers/post.js';
import checkAuth from '../middleware/check-auth.js';
import exractFile from '../middleware/file.js';

const postsRouter = express.Router();

//** POST [ host/api/posts ] **//
postsRouter.post('', checkAuth, exractFile, addPost);

//** PUT [ host/api/posts/:id ] **//
postsRouter.put('/:id', checkAuth, exractFile, updatePost)

//** GET [ host/api/posts ] **//
postsRouter.get('', getAllPosts);

//** GET [ host/api/posts/:id ] **//
postsRouter.get('/:id', getPostById);

//** DELETE [ host/api/posts/:id ] **//
postsRouter.delete('/:id', checkAuth, deletePost)

export default postsRouter;