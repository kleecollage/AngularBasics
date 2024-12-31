import express from 'express';

const app = express();

app.use((req, res, next) => {
  console.log('First Middleware');
  next();
});

app.use((req, res, ext) => {
  console.log('Second Middleware');
  res.send('Hello from express!');
});

export default app