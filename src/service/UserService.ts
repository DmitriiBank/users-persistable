import {User} from "../model/userTypes.js";

export interface  UserService {
    addUser(user:User): boolean;
    updateUser(newUserData:User): boolean;
    removeUser (userId:number): User|null;
    getAllUsers (): object;
    getUser (userId:number): User|null;
}