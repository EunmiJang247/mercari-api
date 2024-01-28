const allRoles = {
  user: [],
  Seller: ['read', 'write', 'delete'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
