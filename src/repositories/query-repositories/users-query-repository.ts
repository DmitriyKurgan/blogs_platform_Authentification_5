import {OutputUserType, UserType} from "../../utils/types";
import {WithId} from "mongodb";
import {getUsersFromDB} from "../../utils/utils";

export const UserMapper = (user : WithId<UserType>) : OutputUserType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}

export async function getAllUsers(query: any): Promise<any | { error: string }> {

    return getUsersFromDB(query);
}