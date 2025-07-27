import {IncomingMessage, ServerResponse} from "node:http";
import {UserController} from "../controllers/UserController.js";
import {PORT} from "../config/userServerConfig.ts";
import {myLogger} from "../events/logger.ts";

export const userRouters = async (req: IncomingMessage, res: ServerResponse, controller: UserController) => {
    myLogger.log('We got the request')
    const {url, method} = req;
    const parsedUrl = new URL(url!, `http://localhost:${PORT}`)


    switch (parsedUrl.pathname  + method) {
        case "/" + "GET" : {
            res.writeHead(200, {"Content-Type": "text/plain"})
            res.end("Welcome to User API")
            break
        }
        case "/api/users" + "POST": {
            await controller.addUser(req, res)
            break
        }
        case "/api/users" + "PUT": {
            await controller.updateUser(req, res)
            break
        }
        case "/api/users" + "DELETE": {
            await controller.removeUser(req, res)
            break
        }
        case "/api/users" + "GET": {
            await controller.getAllUsers(req, res)
            break
        }
        case "/api/user" + "GET": {
            await controller.getUser(req, res, parsedUrl)
            break
        }
        case "/api/logger" + "GET": {
            await controller.getLogArray(req, res)
            break
        }
        default: {
            res.writeHead(404, {"Content-Type": "txt/plain"})
            res.end("Page not found")
        }
    }
}