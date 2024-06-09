import fsPromises from 'fs/promises'
import {supabase} from './supabase.js'

//GET
export const getTickets = async () => {

  const {data, error} = await supabase
    .from('tickets')
    .select('*')
  
  if (error) { 
    throw new Error(error.message)
  }
  // console.log("Fetching tickets:", data)

  return data
}

//POST
export const createTicket = async (ticketData) => {
  // const dbObject = await openDb()
  const id = ticketData.id
  const user_name = ticketData.user_name.trim() === "" ? "Anonymous" : ticketData.user_name;
  const date = ticketData.date
  const description = ticketData.description
  const location = ticketData.location
  const urgencyLevel = ticketData.urgencyLevel

  const newObj = {
    id: id,
    user_name: user_name,
    date: date,
    description: description,
    location, location,
    urgencyLevel: urgencyLevel,
    status: "In Progress",
    comments: []
  }

  const {data, error} = await supabase
    .from('tickets')
    .insert([newObj])
  
  if (error) {
    console.error("Error fetching tickets:", error);
  }
  // dbObject.tickets.push(newObj)
  // await saveData(dbObject)
  return newObj
};


//DELETE
export const deleteTicket = async (ticketID) => {

  const {data, error} = await supabase
    .from('tickets')
    .delete()
    .eq('id', ticketID)
  
  if (error) {
    console.error("Error fetching tickets:", error);
  }

}

export const resolveTicket = async (ticketID) => {
  const {data, error} = await supabase
    .from('tickets')
    .update({status: "Resolved"})
    .eq('id', ticketID)

  if (error) {
    console.error("Error fetching tickets:", error);
  }
}

//PUT
export const editUrgencyLevel = async (ticketID, urgencyLevel) => {
  const {data, error} = await supabase
    .from('tickets')
    .update({urgencyLevel: urgencyLevel})
    .eq('id', ticketID)

  if (error) {
    console.error("Error fetching tickets:", error);
  }
}

//POST
//performing a read and then a write operation every time, need to optimize this.
export const postComment = async (ticketID, commentID, comment, date, submittedBy) => {

  // Fetch the current comments
  //ticketData: {  comments: [ {comment: "hello", date: "2021-09-01", submittedBy: "admin"} ]
  const { data: ticketData, error: fetchError } = await supabase
    .from('tickets')
    .select('comments')
    .eq('id', ticketID)
    .single();

  // console.log("ticketData before comment: ", ticketData)
  
  if (fetchError) {
    console.error("Error fetching ticket:", fetchError);
    return { success: false, error: fetchError };
  }

  // Append the new comment to the existing comments array
  const currentComments = ticketData.comments || [];
  const updatedComments = [...currentComments, {commentID: commentID, comment: comment, date: date, submittedBy: submittedBy}];

  // Update the comments field with the new array
  const { data, UpdateError } = await supabase
    .from('tickets')
    .update({ comments: updatedComments })
    .eq('id', ticketID);

  if (UpdateError) {
    console.error("Error: posted comment, ", UpdateError);
    // console.log(data)
  }
}

//PUT
export const editComment = async (ticketID, commentID, updatedComment, submittedBy) => {
  // Update the comment in the database
  
  const { data: ticketData, error: fetchError } = await supabase
    .from('tickets')
    .select('*') // Fetch all columns
    .eq('id', ticketID)
    .single(); // Ensure only one record is returned

  if (fetchError) {
    throw new Error(`Error fetching ticket: ${fetchError.message}`);
  }
  const commentIndex = ticketData.comments.findIndex(comment => comment.commentID === commentID);

  if (commentIndex === -1) {
    throw new Error(`Comment with ID ${commentID} not found`);
  }

  const updatedComments = [...ticketData.comments];
  //for this particular ticketID
  updatedComments[commentIndex].date = new Date().toLocaleString();
  updatedComments[commentIndex].submittedBy = submittedBy;
  updatedComments[commentIndex].comment = updatedComment.comment; 
  // console.log("updatedComments: ", updatedComments)

  // updatedComments:  [
  //   {
  //     date: '5/28/2024, 4:28:14 PM',
  //     comment: { comment: 'first comment resolved part three' },
  //     commentID: 'c6a26d9a-ad4c-47d5-9f2d-8765f3eb9d42',
  //     submittedBy: 'maanasperi'
  //   },
  //   {
  //     date: '5/28/2024, 4:28:59 PM',
  //     comment: 'oh wait actually its blah blah blah',
  //     commentID: '8bb5fbb2-22ee-4284-83dc-ac008d58dd05',
  //     submittedBy: 'jackysmith'
  //   }
  // ]

  const { data, error } = await supabase
    .from('tickets')
    .update({ comments: updatedComments })
    .eq('id', ticketID);

  if (error) {
    throw new Error(`Error updating comment: ${error.message}`);
  }
}


export const deleteComment = async (ticketID, commentID) => {
  const { data: ticketData, error: fetchError } = await supabase
    .from('tickets')
    .select('comments')
    .eq('id', ticketID)
    .single(); // Ensure only one record is returned

  if (fetchError) {
    throw new Error(`Error fetching ticket: ${fetchError.message}`);
  }

  //filter out commentID out of comments
  const updatedComments = ticketData.comments.filter(comment => comment.commentID !== commentID);

  const { data, error } = await supabase
    .from('tickets')
    .update({ comments: updatedComments })
    .eq('id', ticketID);

  if (error) {
    throw new Error(`Error updating ticket: ${error.message}`);
  }
}

//PATCH
export const reActivateTicket = async (ticketID) => {
  const {data, error } = await supabase 
    .from('tickets')
    .update({status: "In Progress"})
    .eq('id', ticketID)
    .single()

  if (error) {
    throw new Error("Error bringing ticket back to life: ", error.message)
  }
}

