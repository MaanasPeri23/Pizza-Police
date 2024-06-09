import {ServerSession, getServerSession} from 'next-auth/next'
import * as db from '../../services/database.mjs'

export default async function handler(req, res) {
    const session = await getServerSession(req, res)

    if (req.method == "POST") {
        if(!session){
            return res.status(401).json("Unauthorized")
        }
        const commentID = req.body.commentID
        const submittedBy = session.user.name
        const date = new Date().toLocaleString()
        const comment = req.body.fullComment // don't want to read my comments from the query too long
        const ticketID = req.query.ticketID
        
        // console.log("commentID: ", commentID, "comment: ", comment )
        
        try {
            // console.log("here")
            await db.postComment(ticketID, commentID, comment, date, submittedBy);
        } catch (error) {
            return res.status(404).json({message: error.message})
        }

        return res.status(201).json() 
    } 

    if (req.method === "PUT") {
        if (!session) {
            return res.status(401).json("Unauthorized")
        }
        const { commentID, updatedComment } = req.body;
        const ticketID = req.query.ticketID;
        const submittedBy = session.user.name

        try {
            await db.editComment(ticketID, commentID, updatedComment, submittedBy);
        } catch (error) {
            return res.status(404).json({message: error.message});
        }

        return res.status(200).json();
    }

    if (req.method == "DELETE") {
        if (!session){
            return res.status(401).json("Unauthorized")
        }

        const ticketID = req.query.ticketID;
        const commentID = req.body.commentID;

        try {
            // console.log(ticketID, commentID)
            await db.deleteComment(ticketID, commentID);
        } catch (error) {
            return res.status(404).json({message: error.message})
        }

        return res.status(200).json()
    }

}