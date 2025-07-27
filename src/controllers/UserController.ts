import {UserService} from "../service/UserService.js";
import {parseBody} from "../utils/tools.js";
import {User} from "../model/userTypes.js";
import {IncomingMessage, ServerResponse} from "node:http";
import {myLogger} from "../events/logger.js";

export class UserController {
    constructor(private userService: UserService) {
    }

    async addUser(req: IncomingMessage, res: ServerResponse) {
        const body = await parseBody(req) as User
        const isSuccess = this.userService.addUser(body);
        if (isSuccess) {
            res.writeHead(201, {"Content-Type": "text/plain"})
            res.end('User was added')
            myLogger.save(`User created with id ${body.id}`)
        } else {
            res.writeHead(409, {"Content-Type": "text/plain"})
            res.end('User already exists')
            myLogger.save(`Conflict: user with id ${body.id} already exists`)
        }
    }

    async updateUser(req: IncomingMessage, res: ServerResponse) {
        const body = await parseBody(req) as User
        if (!body || !body.id) {
            res.writeHead(400, {"Content-Type": "text/plain"});
            res.end("Invalid user data");
            myLogger.log("Invalid user data")
            return;
        }
        const isUpdated = this.userService.updateUser(body);
        if (isUpdated) {
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("User was updated");
            myLogger.save(`User with id ${body.id} was updated`)
        } else {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("User not found");
            myLogger.save(`Conflict: user with id ${body.id} not found`)
        }
    }

    async removeUser(req: IncomingMessage, res: ServerResponse) {
        const body = await parseBody(req) as User
        const isDelete = this.userService.removeUser(body.id);
        if (isDelete) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(isDelete));
            // emitter.emit('user_removed')
            myLogger.save(`User with id ${body.id} was deleted`)
        } else {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("User not found");
            myLogger.save(`Conflict: user with id ${body.id} not found`)
        }
    }

    async getAllUsers(req: IncomingMessage, res: ServerResponse) {
        const users = this.userService.getAllUsers();
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify(users))
        myLogger.log("All users fetched")
    }

    async getUser(req: IncomingMessage, res: ServerResponse, parsedUrl: URL) {
        const id = parsedUrl.searchParams.get('userId')
        if (!id) {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("User not found");
            myLogger.log("User not found")
            return
        }

        const founded = this.userService.getUser(+id);
        if (founded !== null) {
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(founded))
            myLogger.save(`Fetched user with id: ${id}`)
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'})
            res.end('User not found')
        }

    }

    async getLogArray(req: IncomingMessage, res: ServerResponse) {
        const allLogs = myLogger.getLogArray()
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(allLogs))
    }
}