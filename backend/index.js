import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import User from './models/User.js';
import bcrypt from 'bcrypt';

const app = express();
dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI, {})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB Error', err));

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/auth/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found',
            });
        }
        const validPassword = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );
        if (!validPassword) {
            return res.status(404).json({
                message: 'Invalid email or password',
            });
        }
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret111',
            {
                expiresIn: '24h',
            }
        );
        const { passwordHash, ...userData } = user._doc;
        res.json({ userData, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Не вдалося авторизуватися' });
    }
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const password = req.body.password;
        //Алгоритм шифрування
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const doc = new User({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        });
        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret111',
            {
                expiresIn: '24h',
            }
        );
        const { passwordHash, ...userData } = user._doc;
        res.json({ userData, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Не вдалося зареєструватися' });
    }
});

app.listen(4444, (error) => {
    if (error) {
        return console.error(error);
    }

    console.log('Server started on port 4444');
});
