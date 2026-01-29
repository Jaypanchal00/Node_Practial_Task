const { Router } = require('express');
const taskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();
router.use(requireAuth);

router.get('/', taskController.task_index);
router.get('/create', taskController.task_create_get);
router.post('/create', taskController.task_create_post);
router.get('/edit/:id', taskController.task_edit_get);
router.post('/edit/:id', taskController.task_edit_post);
router.delete('/:id', taskController.task_delete);

module.exports = router;
