import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import Post from './models/post.js';

const app = express();

//** DB CONNECTION **//
mongoose.connect("mongodb+srv://mean_user:rootAccess@cluster0.zeg8wsi.mongodb.net/mean_posts?authMechanism=SCRAM-SHA-1")
 .then(() => {
    console.log("Connected to MongoDB!");
 })
 .catch(() => {
    console.log('Connection failed');
 });

app.use(express.json());
app.use(express.urlencoded({extended: false}));

/* CORS CONFIG V1
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
}) */

//** CORS CONFIG V2 **//
app.use(cors({
  origin: '*', // allow all hosts
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

//** POST [ host/api/post ] **//
app.post('/api/posts', (req,res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  // console.log(post);
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});

//** GET [ host/api/post ] **//
app.get('/api/posts', (req, res, ext) => {
  Post.find()
    .then(documents => {
      // console.log(documents);
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents,
      });
    });
});

export default app