import {Request, Response, Router} from "express";
import {usersService} from "../services/users-service";
import {CodeResponsesEnum} from "../utils/utils";

export const authController = Router({});

authController.post('/login', async (req: Request, res: Response) => {
      debugger
      const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
      if (checkResult){
        res.status(CodeResponsesEnum.Not_content_204)
      }
});

