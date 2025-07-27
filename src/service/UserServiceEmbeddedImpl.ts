import {UserService} from "./UserService.js";
import {User} from "../model/userTypes.js";
import {UserFilePersistenceService} from "./UserFilePersistenceService.js";
import fs from "fs";
import {myLogger} from "../events/logger.js";


export class UserServiceEmbeddedImpl implements UserService, UserFilePersistenceService{
    private users: User[] = [{id:1, userName:"Bond"}]
    private rs = fs.createReadStream('data.txt', {encoding: "utf-8", highWaterMark: 24})

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

    restoreDataFromFile(): string {
        let result = ""
        this.rs.on('data', (chunk) => {
            if(chunk)
                result += chunk.toString()
            else {
                result = "[]"
            }

        })

        this.rs.on('end', () => {
            if(result){
                this.users = JSON.parse(result)
                myLogger.log("Data was restored from file")
                myLogger.save("Data was restored from file")
                this.rs.close()
            }else {
                this.users = [{id:3, userName:"Panikovsky"}]
            }
        })

        this.rs.on('error', () => {
            this.users = [{id:2, userName:"Bender"}]
            myLogger.log("File to restored not found")
        })
        return "Ok";
    }

    saveDataToFile(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const ws = fs.createWriteStream('data.txt', {flags: "w"})
                myLogger.log("Ws created")
                const data = JSON.stringify(this.users);
                myLogger.log(data)
                ws.write((data), (e) => {
                    if(e)
                        myLogger.log("Error!" + e?.message)
                })
                ws.on('finish', () => {
                    myLogger.log("Data was saved to file");
                    myLogger.save("Data was saved to file");
                    ws.end();
                })
                ws.on('error', () => {
                    myLogger.log("error: data not saved!")
                })
                return "Ok";
            } catch (error) {
                console.error('saveDataToFile error:', error);
                myLogger.log('saveDataToFile error: ');
            }

            return "Ok";
        })
    }

    saveDataToFileSync(): string {
        try {
            const data = JSON.stringify(this.users);
            fs.writeFileSync('data.txt', data, 'utf-8');
            myLogger.log("Data was saved to file synchronously");
            myLogger.save("Data was saved to file synchronously");

            return "Ok";
        } catch (error) {
            console.error('Error saving data:', error);
            myLogger.log('Error saving data');
            return "Error";
        }
    }
};

