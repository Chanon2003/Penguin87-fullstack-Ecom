import { body } from "express-validator";

export const formValidate = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

  body("name")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

    body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
];

export const resetPasswordValidate = [
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),

  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),

];