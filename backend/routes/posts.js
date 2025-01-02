import express from 'express';
import pkg from 'multer';
import checkAuth from '../middleware/check-auth.js';
import { Post } from '../models/post.js';

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
postsRouter.post('', checkAuth, multer({storage: storage}).single('image'), (req,res,next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
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
postsRouter.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
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
    imagePath: imagePath,
    creator: req.userData.userId
  };

  // console.log(updatePost);
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, updatePost).then(result => {
    // console.log(result);
    if (result.modifiedCount > 0)
      res.status(200).json({message: 'Update Successful!'});
    else res.status(401).json({message: 'Not Authorized'});
  }).catch(e => {
    console.error(error);
    res.status(500).json({ message: 'Failed to update post.' });
  });

})

//** GET [ host/api/posts ] **//
postsRouter.get('', (req, res, ext) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery.then(documents => {
      // console.log(documents);
      fetchedPosts = documents;
      return Post.countDocuments()
    }).then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

//** GET [ host/api/posts/:id ] **//
postsRouter.get('/:id', (req, res, ext) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Oops. Post not found!'})
    }
  })

});

//** DELETE [ host/api/posts/:id ] **//
postsRouter.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
      // console.log(req.params.id);
      if (result.deletedCount > 0)
        res.status(200).json({message: 'Post deleted!'})
      else res.status(401).json({message: 'Not Authorized'});
    })
})

export default postsRouter;