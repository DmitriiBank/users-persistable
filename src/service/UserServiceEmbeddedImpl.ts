import {UserService} from "./UserService.js";
import {User} from "../model/userTypes.js";


export class UserServiceEmbeddedImpl implements UserService{
    private users: User[] = [{id:1, userName:"Bond"}]
    addUser(user: User): boolean {
        if(this.users.findIndex((u:User) => u.id === user.id) === -1) {
            this.users.push(user)
            return true
        }
        return false
    }

    getAllUsers(): User[] {
        return [...this.users];
    }

    getUser(userId: number): User | null {
        return this.users.find(user => user.id === userId) || null;
    }

    removeUser(userId: number): User | null {
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
            const res = this.users.splice(index, 1)
            return res[0]
        }
        return null
    }

    updateUser(newUserData: User): boolean {
        const index = this.users.findIndex(user => user.id === newUserData.id);
        if (index !== -1) {
            this.users[index] = newUserData
            return true
        }
        return false
    }
};

