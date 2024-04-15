import {OutputUserType, UserType} from "../utils/types";
import {usersRepository} from "../repositories/users-repository";
export const users = [] as UserType[]

export const usersService:any = {

    async createUser(body:UserType):Promise<OutputUserType | null> {
        const newUser:UserType = {
            login: body.login,
            email: body.email,
            createdAt: body.createdAt
        }
        const createdUser:OutputUserType | null = await usersRepository.createUser(newUser);
        return createdUser;
    },
   async deleteUser(userID:string): Promise<boolean>{
       return await usersRepository.deleteUser(userID);
    }

}