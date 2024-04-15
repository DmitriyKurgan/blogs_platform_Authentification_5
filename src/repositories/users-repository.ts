import {usersCollection} from "./db";
import {InsertOneResult, ObjectId, DeleteResult} from "mongodb";
import {OutputUserType, UserType} from "../utils/types";
import {UserMapper} from "./query-repositories/users-query-repository";

export const usersRepository = {

    async createUser(newUser:UserType):Promise<OutputUserType | null> {
        const result:InsertOneResult<UserType> = await usersCollection.insertOne(newUser);
        const user = await usersCollection.findOne({_id: result.insertedId});
        return user ? UserMapper(user) : null;
    },
   async deleteUser(userID:string): Promise<boolean>{
        const result: DeleteResult = await usersCollection.deleteOne({_id:new ObjectId(userID)});
        return result.deletedCount === 1
    }

}