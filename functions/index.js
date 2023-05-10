import functions from "firebase-functions"
import express from "express"
import cors from "cors"

const app = express()
app.use(cors({origin: [
    'https://localhost',
    'https://bocacode.com'
]})) //allow only this websited or urls to talk to this api

//let's set our un-protected rotes

app.post('/login')
app.post('/signup')

//now we setup protected routes


app.listen(3030, () => console.log('Listening on port 3030...'))

export const api = functions.https.onRequest(app)
