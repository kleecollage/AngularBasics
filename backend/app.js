import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
})

app.post('/api/posts', (req,res,next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/posts', (req, res, ext) => {
  const posts = [
    {
      id: 'kAfce13',
      title: 'First server-side post',
      content: 'This is comming from the server'
    },
    {
      id: 'lMdnw57',
      title: 'Second server-side post',
      content: 'This is comming from the server!'
    },
    {
      id: 'mQkfn01',
      title: 'Third server-side post',
      content: 'This is comming from the server!!! uwu'
    },
  ]

  res.status(200).json({
    message: 'Posts fetched successfully',
    posts: posts,
  });
});

export default app