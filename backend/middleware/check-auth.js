import jwt from "jsonwebtoken";

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'Secret_Seed')
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Not authorized'
    })
  }

}