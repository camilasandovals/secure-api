import { db } from "./connect.js"

export async function login(req, res) {
    const {email, password} = req.body
    if(!email || !password ) {
        res.status(400).send({message: 'Email and password both requried'})
        return
    }
    const userResults = await db.collection("users")
    .where("email", "==", email.toLowerCase())
    .where("password", "==", password)
    .get()
    let user = userResults.docs.map(doc => ({ id: doc.id, ...doc.data()}))[0]
    delete user.password
    res.send(user)
}

export async function signup(req, res) {
    const { email, password } = req.body
    if(!email || !password) {
        res.staus(400).send({message:"EMail and password both required"})
        return
    }
    await db.collection("users").add({email:email.toLowerCase(), password})
    login(req,res)
}
