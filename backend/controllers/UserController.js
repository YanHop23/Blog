import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
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
            process.env.JWT_SECRET,
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
};

export const register = async (req, res) => {
    try {
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
            process.env.JWT_SECRET,
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
};

export const checkMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Користувач не найдений',
            });
        }
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (error) {}
};
