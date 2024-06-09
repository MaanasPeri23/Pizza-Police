import {ServerSession, getServerSession} from 'next-auth/next'
import * as db from '../../services/database.mjs'

export default async function handler(req, res) {
    const session = await getServerSession(req, res)
    // console.log("Session data: ", session)

    if (req.method == "GET"){
        //if you're not signed in, can't get list of tickets
        if(!session){
            return res.status(401).json("Unauthorized")
        }
        //if you are signed in, then this is 200 status
        const tickets = await db.getTickets()
        
        // console.log("Tickets: ", tickets)
        return res.status(200).json(tickets);
    } 
    
    if (req.method == "POST") {
        //can create ticket if your not signed in
        const data = req.body;
        if (!data.id){
            return res.status(400).json({message: "Missing name field"})
        }

        // console.log("Post Session: ", session)
        const createTicket = await db.createTicket({id: data.id, user_name: data.userName, date: data.date, description: data.description, location: data.location, urgencyLevel: data.urgencyLevel})

        return res.status(201).json(createTicket)
    } 
    
    if (req.method == "DELETE") {

        if (!session) {
            return res.status(401).json("Unauthorized")
        }
        //req.query is an object containing a property for each query string parameter in the route. If there is no query string, it is an empty object, {}.
        const ticketID = req.query.ticketID;
        try {
            await db.resolveTicket(ticketID);
            
        } catch (error) {
            return res.status(404).json({message: error.message})
        }
        return res.status(200).send();
    } 
    
    if (req.method == "PUT") {

        //no one except admins can edit and prioritize urgencyLevel
        if (!session){
            return res.status(401).json("Unauthorized")
        }
        //parsing in ticketID and urgencyLevel when admin interacts with the fields 
        const ticketID = req.query.ticketID;
        const urgencyLevel = req.query.urgencyLevel;

        try {
            await db.editUrgencyLevel(ticketID, urgencyLevel)
            
        } catch (error) {
            return res.status(404).json({message: error.message})
        }
        return res.status(200).send();
    }

    if (req.method == "PATCH") {
        if (!session) {
            return res.status(401).json("Unauthorized")
        }

        const ticketID = req.query.ticketID;

        try {
            await db.reActivateTicket(ticketID)
        } catch (error) {
            return res.status(404).json({message: error.message})
        }

        return res.status(200).send();
    }

}
