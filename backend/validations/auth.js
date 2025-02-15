import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Не правильний формат почти').isEmail(),
    body('password', 'Пароль повинен мати більше 5 символів').isLength({
        min: 5,
    }),
    body('fullName', 'Закоротке імя(мінімум 3 символа)').isLength({ min: 3 }),
    body('avatarUrl', 'Не правильний формат зображення').optional().isURL(),
];
