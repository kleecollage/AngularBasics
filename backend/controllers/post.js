import { Post } from '../models/post.js';

export const addPost = (req, res, next) => {
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
    })
    .catch(error => {
      res.status(500).json({message: 'Failed on creating post :('})
    });
}

export const updatePost = (req, res, next) => {
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
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, updatePost)
    .then(result => {
      // console.log(result);
      if (result.modifiedCount >= 0)
        res.status(200).json({ message: 'Update Successful!' });
      else res.status(401).json({ message: 'You are not authorized to update this post' });
  }).catch(e => {
    console.error(error);
    res.status(500).json({ message: 'Failed to update post.' });
  });
}


export const getAllPosts = (req, res, next) => {
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
    }).catch(e => {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetching posts :(' });
    });
};

export const getPostById = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Oops. Post not found!'})
    }
  }).catch(e => {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch post :(' });
  });

}

export const deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    // console.log(req.params.id);
    if (result.deletedCount > 0)
      res.status(200).json({message: 'Post deleted!'})
    else res.status(401).json({message: 'Not Authorized'});
  }).catch(e => {
    console.error(error);
    res.status(500).json({ message: 'Failed to deleting post :(.' });
  });
}