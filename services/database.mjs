import fsPromises from 'fs/promises'

export const openDb = async () => {

  let dbObject = {
    tickets: []
  }

  try {

    const text = await fsPromises.readFile('/tmp/db.json')
    return JSON.parse(text)

  } catch (err) {

    await saveData(dbObject)
    return dbObject
  }
}

//GET
export const getTickets = async () => {
  const dbObject = await openDb()
  const res = dbObject.tickets
  return res
}

//POST
export const createTicket = async (ticketData) => {
  const dbObject = await openDb()
  const id = ticketData.id
  const user = ticketData.user.trim() === "" ? "Anonymous" : ticketData.user;
  const date = ticketData.date
  const description = ticketData.description
  const location = ticketData.location
  const urgencyLevel = ticketData.urgencyLevel

  const newObj = {
    id: id,
    user: user,
    date: date,
    description: description,
    location, location,
    urgencyLevel: urgencyLevel,
    comments: []
  }
  dbObject.tickets.push(newObj)


  await saveData(dbObject)
  
  return newObj
};


//DELETE
export const deleteTicket = async (ticketID) => {
  const dbObject = await openDb()
  // Find the index of the ticket with the specified ID
  const ticketIndex = dbObject.tickets.findIndex(ticket => ticket.id === ticketID);
  // Check if the ticket exists
  if (ticketIndex === -1) {
    throw new Error(`Ticket with ID ${ticketID} not found`);
  }
  // console.log("selected delete: ", dbObject.tickets[ticketIndex])
  // Remove the ticket from the array using splice
  dbObject.tickets = dbObject.tickets.filter(ticket => ticket.id !== ticketID);
  // Save the updated data
  await saveData(dbObject);
}

//PUT
export const editUrgencyLevel = async (ticketID, urgencyLevel) => {
  const dbObject = await openDb()

  //another way to find out if ticket does/doesnt exist 
  const ticketToChange = dbObject.tickets.find(ticket => ticket.id == ticketID)
  if (!ticketToChange) {
    throw new Error(`Ticket with ID ${ticketID} not found`);
  }
  ticketToChange.urgencyLevel = urgencyLevel;

  await saveData(dbObject)

}

//POST
export const postComment = async (ticketID, comment) => {
  const dbObject = await openDb()

  const ticketToCommentOn = dbObject.tickets.find(ticket => ticket.id == ticketID)

  if (!ticketToCommentOn) {
    throw new Error(`Ticket with ID ${ticketID} not found`)
  }

  //need to print this tickets to see if the comments are staying in the object, after being posted. or need to write anohter fetch? dont think so but just make sure to print every time you post a comment
  ticketToCommentOn.comments.push(comment)
  // console.log("ticket found", ticketToCommentOn) // why is this an object? 
  //unable to do this;
  await saveData(dbObject)

}


const saveData = async (dbObject) => {
  await fsPromises.writeFile('/tmp/db.json', JSON.stringify(dbObject))
}


export const clear = async () => {
  try {
    await fsPromises.rm('/tmp/db.json')
  } catch(err) {} // ignore error if file doesnt exist
};