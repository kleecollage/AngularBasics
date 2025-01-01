import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import router from './routes/posts.js';

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
app.use("/images", express.static(path.join('backend/images')))

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
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

app.use("/api/posts", router);

export default app