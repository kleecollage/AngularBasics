import express from 'express';
import pkg from 'multer';
import { Post } from '../models/post.js';
const { multer } = pkg;

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = pkg.diskStorage({
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
router.post('', pkg({storage: storage}).single('image'), (req,res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  // console.log(post);
  post.save().then(result => {
    // console.log(result);
    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    });
  });
});

//** PUT [ host/api/posts/:id ] **//
router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: 'Update Successful!'})
  });
})

//** GET [ host/api/posts ] **//
router.get('', (req, res, ext) => {
  Post.find()
    .then(documents => {
      // console.log(documents);
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents,
      });
    });
});

//** GET [ host/api/posts/:id ] **//
router.get('/:id', (req, res, ext) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Oops. Post not found!'})
    }
  })

});

//** DELETE [ host/api/posts/:id ] **//
router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      // console.log(req.params.id);
      res.status(200).json({message: 'Post deleted!'})
    })
})

export default router;