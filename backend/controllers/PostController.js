import PostSchema from '../models/Post.js';
import Post from '../models/Post.js';

export const createPost = async function (req, res) {
    try {
        const doc = await Post.create({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            user: req.userId,
            imageUrl: req.body.imageUrl,
        });
        const post = await doc.save();
        res.json(post);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Error creating post',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostSchema.find().populate('user').exec();
        res.json(posts);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Error getting posts',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id || req.query.id;

        if (!postId) {
            return res.status(400).json({ message: 'ID не вказано' });
        }

        const doc = await PostSchema.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        );

        if (!doc) {
            return res.status(404).json({ message: 'Стаття не знайдена' });
        }

        console.log(doc);
        res.json(doc);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Error getting one post' });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id || req.query.id;

        if (!postId) {
            return res.status(400).json({ message: 'ID не вказано' });
        }

        const doc = await PostSchema.findByIdAndDelete(postId);

        if (!doc) {
            return res.status(404).json({ message: 'Пост не знайдено' });
        }

        res.status(200).json({ message: 'Пост успішно видалено' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Помилка при видаленні поста' });
    }
};

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id || req.query.id;

        const doc = await Post.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                user: req.userId,
                imageUrl: req.body.imageUrl,
            }
        );
        res.json({
            message: 'success',
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Error updating post',
        });
    }
};
