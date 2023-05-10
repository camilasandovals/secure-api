import { hashSync } from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from "./connect.js"
import { salt, secretKey } from "../service_account.js"

export async function login(req, res) {
    const {email, password} = req.body
    if(!email || !password ) {
        res.status(400).send({message: 'Email and password both requried'})
        return
    }
    const hashedPassword = hashSync(password, salt)
    const userResults = await db.collection("users")
        .where("email", "==", email.toLowerCase())
        .where("password", "==", hashedPassword)
        .get()
    let user = userResults.docs.map(doc => ({ id: doc.id, ...doc.data()}))[0]
    if(!user){
        res.status(401).send({message:"Invalid email or password"})
        return
    }
    delete user.password
    const token = jwt.sign(user, secretKey)
    res.send({user, token})
    res.send(user)
}

export async function signup(req, res) {
    const { email, password } = req.body
    if(!email || !password) {
        res.staus(400).send({message:"Email and password both required"})
        return
    }
    //check to see if email already exists
    const check = await db.collection("users").where("email", "==", email.toLowerCase()).get()
    if(check.exists){
        res.status(401).send({message: "Email already exists. Please try logging in instead"})
    }
    const hashedPassword = hashSync(password, salt)
    await db.collection("users").add({email:email.toLowerCase(), password})
    await db.collection("users").insertOne({email:email.toLowerCase(), password}) //for MONGO
    login(req,res)
}
