import {ServerSession, getServerSession} from 'next-auth/next'
import * as db from '../../services/database.mjs'

export default async function handler(req, res) {
    const session = await getServerSession(req, res)

    if (req.method == "POST") {
        if(!session){
            return res.status(401).json("Unauthorized")
        }
        
        const comment = req.body // don't want to read my comments from the query too long
        const ticketID = req.query.ticketID
        
        console.log("post comment debugging: ", ticketID, " ", comment)
        
        try {
            console.log("here")
            await db.postComment(ticketID, comment);
            console.log("here2")
        } catch (error) {
            return res.status(404).json({message: error.message})
        }

        return res.status(201).json() //difference between 201 and 200?
    } 

}