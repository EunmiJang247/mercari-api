const express = require('express');

// const authRoute = require('./auth.route');

const router = express.Router();

const adminRoute = [
  // {
  //   path: '/auth',
  //   route: authRoute,
  // },
];

adminRoute.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
