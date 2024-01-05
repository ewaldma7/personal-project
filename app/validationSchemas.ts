import { z } from "zod";

const questionSchema = z.object({
    question_id: z.number(),
    question: z.string(),
    answer: z.string(),
    category: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().optional()
});

export const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required.').max(255),
    email: z.string().email('Email is required in proper format.'),
    password: z
        .string()
        .min(8, { message: 'Password should be at least 8 characters.' })
        .refine(value => {
            // Define your custom password requirements here
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasDigit = /[0-9]/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value); // Add your desired special characters
            
            return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
        }, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.' })
});

export const createQuestionSchema = z.object({
    question: z.string().min(1, 'Question is required.'),
    answer: z.string().min(1, 'Answer is required.').max(255),
    category: z.string().min(1, 'Category is required.').max(255),
});

export const createGameSchema = z.object({
    date: z.date(),
    questions: z.array(questionSchema)
});