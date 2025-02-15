import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userController, postController } from './controllers/index.js';
import {
    loginValidation,
    postCreateValidation,
    registerValidation,
} from './validations/validations.js';
import {
    handleValidationsErrors,
    authMiddleware,
} from './middlewares/index.js';

const app = express();
dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI, {})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB Error', err));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, './uploads/');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/upload', express.static('uploads'));
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.filename}`,
    });
});

app.get('/auth/me', authMiddleware, userController.checkMe);

app.post(
    '/auth/login',
    loginValidation,
    handleValidationsErrors,
    userController.login
);

app.post(
    '/auth/register',
    registerValidation,
    handleValidationsErrors,
    userController.register
);

app.post(
    '/posts',
    authMiddleware,
    postCreateValidation,
    postController.createPost
);

app.get('/posts/:id', postController.getOne);
app.get('/posts', postController.getAll);
app.delete('/posts/:id', authMiddleware, postController.deletePost);
app.patch('/posts/:id', authMiddleware, postController.updatePost);

app.listen(4444, (error) => {
    if (error) {
        return console.error(error);
    }

    console.log('Server started on port 4444');
});
