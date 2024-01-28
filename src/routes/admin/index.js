const express = require('express');
 const authRoute = require('../admin/auth.route');
 const sellerRoute = require('../admin/seller.route');
const router = express.Router();
const adminRoute = [
{
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/seller',
    route: sellerRoute,
  },
];

adminRoute.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
