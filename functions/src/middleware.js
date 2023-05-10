import jwt from "jsonwebtoken"
import { secretKey } from "../service_account.js"

export function validToken(req, res, next) {
    if(!req.headers || !req.headers.authorization){
        res.status(400).send({message: "Security token required"})
        return
    }
    const decodedToken = jwt.verify(re.headers.authorization, secretKey)
    if(!decodedToken) {
        res.status(401).send({ message: "Invalid secutiry token."})
        return
    }
    next()
}