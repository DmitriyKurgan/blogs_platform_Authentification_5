import {Request, Response, Router} from "express";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {OutputUserType} from "../utils/types";
import {
    validateAuthorization, validateDeleteUserByParamId,
    validateErrorsMiddleware, validateUsersRequests,
} from "../middlewares/middlewares";
import {getAllUsers} from "../repositories/query-repositories/users-query-repository";
import {users, usersService} from "../services/users-service";

export const usersController = Router({});

usersController.get('/', validateAuthorization, validateErrorsMiddleware, async (req: Request, res: Response) => {
    const queryValues = getQueryValues({
        pageNumber:req.query.pageNumber,
        pageSize:req.query.pageSize,
        sortBy:req.query.sortBy,
        sortDirection:req.query.sortDirection,
        searchNameTerm:req.query.searchLoginTerm,
        searchEmailTerm:req.query.searchEmailTerm});
    const users = await getAllUsers({...queryValues});
    if (!users || !users.items.length) {
        return res.status(CodeResponsesEnum.Not_found_404).send([])
    }
    res.status(CodeResponsesEnum.OK_200).send(users)
})


usersController.post('/', validateAuthorization, validateUsersRequests, validateErrorsMiddleware, async (req: Request, res: Response) => {
    const newUser: OutputUserType | null = await usersService.createUser(req.body);
    if (newUser) {
        users.push(newUser);
        res.status(CodeResponsesEnum.Created_201).send(newUser);
    }
});

usersController.delete('/:id', validateAuthorization, validateDeleteUserByParamId, validateErrorsMiddleware, async (req: Request, res: Response) => {
    const userID: string = req.params.id;
    const isDeleted: boolean = await usersService.deleteUser(userID);
    if (!isDeleted || !userID) {
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
})


