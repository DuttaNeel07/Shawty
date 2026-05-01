const express = require('express');
const router = express.Router();
const linkController = require('../controllers/link.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/',            authMiddleware, linkController.getAllLinks);
router.post('/',           authMiddleware, linkController.createLink);
router.patch('/:id',       authMiddleware, linkController.updateLink);
router.delete('/:id',      authMiddleware, linkController.deleteLink);
router.get('/:id/stats',   authMiddleware, linkController.getLinkStats);

module.exports = router;