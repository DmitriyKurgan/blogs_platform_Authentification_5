import { Request, Response, NextFunction } from 'express';
import {body, param, ValidationError, validationResult} from 'express-validator';
import {blogsService} from "../services/blogs-service";
import {blogsRepository} from "../repositories/blogs-repository";
import {usersRepository} from "../repositories/users-repository";
const websiteUrlPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
const loginPattern =
    /^[a-zA-Z0-9_-]*$/;
const emailpattern =
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const validateBlogsRequests = [
    body("name")
        .exists()
        .withMessage("Name is required")
        .isString()
        .withMessage("Type of name must be string")
        .trim()
        .isLength({
            min: 1,
            max: 15,
        })
        .withMessage(
            "Name length must be more than 0 and less than or equal to 15 symbols"
        ),
    body("description")
        .exists()
        .withMessage("Description is required")
        .isString()
        .withMessage("Type of description must be string")
        .trim()
        .isLength({
            min: 1,
            max: 500,
        })
        .withMessage(
            "Description length must be more than 0 and less than or equal to 500 symbols"
        ),
    body("websiteUrl")
        .exists()
        .withMessage("Website URL is required")
        .isString()
        .withMessage("Type of Website URL must be string")
        .trim()
        .isLength({
            min: 1,
            max: 100,
        })
        .withMessage(
            "Website URL length must be more than 0 and less than or equal to 100 symbols"
        )
        .matches(websiteUrlPattern)
        .withMessage("Website URL must be in correct format"),
];

export const validatePostsRequests = [
    body("title")
        .exists()
        .withMessage("Title is required")
        .isString()
        .withMessage("Type of title must be string")
        .trim()
        .isLength({
            min: 1,
            max: 30,
        })
        .withMessage(
            "Title length must be more than 0 and less than or equal to 30 symbols"
        ),
    body("shortDescription")
        .exists()
        .withMessage("Short description is required")
        .isString()
        .withMessage("Type of short description must be string")
        .trim()
        .isLength({
            min: 1,
            max: 100,
        })
        .withMessage(
            "Short description length must be more than 0 and less than or equal to 100 symbols"
        ),
    body("content")
        .exists()
        .withMessage("Content is required")
        .isString()
        .withMessage("Type of content must be string")
        .trim()
        .isLength({
            min: 1,
            max: 1000,
        })
        .withMessage(
            "Short description length must be more than 0 and less than or equal to 1000 symbols"
        ),
];

export const validateUsersRequests = [
    body("login")
        .exists()
        .withMessage("Login is required")
        .isString()
        .withMessage("Type of Login must be string")
        .matches(loginPattern)
        .trim()
        .withMessage("Login must be in correct format")
        .isLength({
            min: 3,
            max: 30,
        })
        .withMessage(
            "Login length must be more than 2 and less than or equal to 30 symbols"
        ),
    body("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Type of password must be a string")
        .trim()
        .isLength({
            min: 6,
            max: 20,
        })
        .withMessage(
            "Short description length must be more than 0 and less than or equal to 100 symbols"
        ),
    body("email")
        .exists()
        .withMessage("Email is required")
        .isString()
        .withMessage("Type of email must be string")
        .trim()
        .matches(emailpattern)
        .withMessage("Email must be in correct format")
];

export const validateBlogIdForPostsRequests = [
    body("blogId")
        .exists()
        .withMessage("Blog ID is required")
        .isString()
        .withMessage("Type of Blog ID must be string"),
]

export const validationBlogsFindByParamId = param("id").custom(
    async (value) => {
        const result = await blogsRepository.findBlogByID(value);
        if (!result) {
            throw new Error("ID not found");
        }
        return true;
    }
);

export const validateDeleteUserByParamId = param("id").custom(
    async (value) => {
        const result = await usersRepository.deleteUser(value);
        if (!result) {
            throw new Error("ID not found");
        }
        return true;
    }
);


export const validateAuthorization = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401);
    } else {
        next();
    }
};

export const validateErrorsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorFormatter = ({ msg, param }: ValidationError) => {
        return {
            message: msg,
            field: param,
        };
    };

    const result = validationResult(req).formatWith(errorFormatter);
    const idFinder = result.array().find((e) => e.field === "id");
    const deviceIdFinder = result.array().find((e) => e.field === "deviceId");

    if (idFinder || deviceIdFinder) {
        res.status(404).json({ errorsMessages: result.array() });
        return;
    }

    if (!result.isEmpty()) {
        res
            .status(400)
            .json({ errorsMessages: result.array({ onlyFirstError: true }) });
    } else {
        next();
    }
};

export const validationPostsCreation = body("blogId").custom(async (value) => {
    const result = await blogsRepository.findBlogByID(value);
    if (!result) {
        throw new Error("Blog with provided ID not found");
    }
    return true;
});
