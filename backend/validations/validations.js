import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Не правильний формат почти').isEmail(),
    body('password', 'Пароль повинен мати більше 5 символів').isLength({
        min: 5,
    }),
    body('fullName', 'Закоротке імя(мінімум 3 символа)').isLength({ min: 3 }),
    body('avatarUrl', 'Не правильний формат зображення').optional().isURL(),
];

export const loginValidation = [
    body('email', 'не правильний емейл').isEmail(),
    body('password', 'Пароль повинен мати більше 5 символів').isLength({
        min: 5,
    }),
];

export const postCreateValidation = [
    body('title', 'Введіть назву статті').isLength({ min: 3 }).isString(),
    body('text', 'Введіть текст статті').isLength({ min: 3 }).isString(),
    body('tags', 'невірний формат тегів').optional().isArray(),
    body('imageUrl', 'Не правильне посилання на зображення')
        .optional()
        .isString(),
];
