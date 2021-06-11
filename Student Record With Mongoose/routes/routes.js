const express = require('express');
const accessControl = require('../middlewares/accessControl');

const controllers = require('../controllers/controllers');

const router = express.Router();

router.get('/', accessControl, controllers.getRecords);
router.get('/newStudent', accessControl, controllers.newStudent);
router.get('/editStudent/:id', accessControl, controllers.editStudent);
router.post('/postNewStudent', accessControl, controllers.postNewStudent);
router.post('/postUpdatedStudent', accessControl, controllers.postUpdatedStudent);
router.get('/deleteStudent/:id', accessControl, controllers.deleteStudent);

module.exports = router;