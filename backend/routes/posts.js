import express from 'express';
import pkg from 'multer';
import { Post } from '../models/post.js';
const  multer  = pkg;

const router = express.Router();

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
router.post('', multer({storage: storage}).single('image'), (req,res,next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  // console.log(post);
  post.save().then(createdPost => {
    // console.log(result);
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  });
});

//** PUT [ host/api/posts/:id ] **//
router.put('/:id', multer({storage: storage}).single('image'), (req, res, next) => {
  // console.log(req.file);
  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }

  const updatePost = {
    // _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  };

  // console.log(updatePost);

  Post.updateOne({_id: req.params.id}, updatePost).then(result => {
    // console.log(result);
    res.status(200).json({message: 'Update Successful!'})
  }).catch(e => {
    console.error(error);
    res.status(500).json({ message: 'Failed to update post.' });
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