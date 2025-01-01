import express from 'express';
import { Post } from '../models/post.js';

const router = express.Router();

//** POST [ host/api/posts ] **//
router.post('', (req,res,next) => {
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