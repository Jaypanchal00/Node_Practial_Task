const Task = require('../models/Task');
const User = require('../models/User');


const task_index = async (req, res) => {
    try {
        let tasks;
        if (res.locals.user.role === 'admin') {
            tasks = await Task.find().populate('user', 'username').sort({ createdAt: -1 });
        } else {
            tasks = await Task.find({ user: res.locals.user._id }).sort({ createdAt: -1 });
        }
        res.render('taskList', { title: 'All Tasks', tasks });
    } catch (err) {
        console.log(err);
        res.status(500).render('404', { title: 'Error' });
    }
};

const task_create_get = (req, res) => {
    res.render('taskForm', { title: 'Create Task', task: null });
};


const task_create_post = async (req, res) => {
    const { title, description, status } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            status,
            user: res.locals.user._id
        });
        await User.findByIdAndUpdate(res.locals.user._id, { $push: { tasks: task._id } });

        res.redirect('/tasks');
    } catch (err) {
        console.log(err);
        res.render('taskForm', { title: 'Create Task', task: null, error: 'Error creating task' });
    }
};


const task_delete = async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findById(id);
        if (res.locals.user.role !== 'admin' && task.user.toString() !== res.locals.user._id.toString()) {
            return res.status(403).json({ redirect: '/tasks' });
        }

        await Task.findByIdAndDelete(id);
        res.json({ redirect: '/tasks' });
    } catch (err) {
        console.log(err);
        res.status(404).json({ redirect: '/tasks' });
    }
};


const task_edit_get = async (req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findById(id);

        if (res.locals.user.role !== 'admin' && task.user.toString() !== res.locals.user._id.toString()) {
            return res.redirect('/tasks');
        }

        res.render('taskForm', { title: 'Edit Task', task });
    } catch (err) {
        res.status(404).render('404', { title: 'Task not found' });
    }
};

const task_edit_post = async (req, res) => {
    const id = req.params.id;
    const { title, description, status } = req.body;

    try {
        const task = await Task.findById(id);
        if (res.locals.user.role !== 'admin' && task.user.toString() !== res.locals.user._id.toString()) {
            return res.redirect('/tasks');
        }

        await Task.findByIdAndUpdate(id, { title, description, status });
        res.redirect('/tasks');
    } catch (err) {
        console.log(err);
        res.redirect(`/tasks/edit/${id}`);
    }
};


module.exports = {
    task_index,
    task_create_get,
    task_create_post,
    task_delete,
    task_edit_get,
    task_edit_post
};
