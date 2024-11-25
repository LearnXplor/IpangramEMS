const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
   try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

      if (!token) {
         return res.status(401).json({ message: 'Unauthorized. Token is missing.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.id;
      req.role = decoded.role;

      next(); 
   } catch (error) {
      res.status(403).json({ message: 'Invalid or expired token.' });
   }
};

module.exports = auth;
