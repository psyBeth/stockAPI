'use strict'

const router = require('express').Router();

const firm = require('../controllers/firm');
const permissions = require('../middlewares/permissions');

// URL: /firms:

router.route('/(:id)?')
    .post(permissions.isAdmin, firm.create)
    .get(permissions.isStaff, firm.read)
    .put(permissions.isAdmin, firm.update)
    .patch(permissions.isAdmin, firm.update)
    .delete(permissions.isAdmin, firm.delete)

module.exports = router;