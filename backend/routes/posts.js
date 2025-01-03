import express from 'express';
import pkg from 'multer';
import { addPost, deletePost, getAllPosts, getPostById, updatePost } from '../controllers/post.js';
import checkAuth from '../middleware/check-auth.js';

const  multer  = pkg;
const postsRouter = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid mime type")
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

//** POST [ host/api/posts ] **//
postsRouter.post('', checkAuth, multer({storage: storage}).single('image'), addPost);

//** PUT [ host/api/posts/:id ] **//
postsRouter.put('/:id', checkAuth, multer({storage: storage}).single('image'), updatePost)

//** GET [ host/api/posts ] **//
postsRouter.get('', getAllPosts);

//** GET [ host/api/posts/:id ] **//
postsRouter.get('/:id', getPostById);

//** DELETE [ host/api/posts/:id ] **//
postsRouter.delete('/:id', checkAuth, deletePost)

export default postsRouter;