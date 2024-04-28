import {usersCollection} from "./db";
import {InsertOneResult, ObjectId, DeleteResult} from "mongodb";
import {OutputUserType, UserDBType} from "../utils/types";
import {UserMapper} from "./query-repositories/users-query-repository";

export const usersRepository = {

    async createUser(newUser:UserDBType):Promise<OutputUserType | null> {
        const result:InsertOneResult<any> = await usersCollection.insertOne(newUser);
        const user = await usersCollection.findOne({_id: result.insertedId});
        debugger
        return user ? UserMapper(user as any) : null;
        // return user ?? null;
    },
   async deleteUser(userID:string): Promise<boolean>{
        const result: DeleteResult = await usersCollection.deleteOne({_id:new ObjectId(userID)});
        return result.deletedCount === 1
    }

}