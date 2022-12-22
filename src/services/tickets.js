import axiosDo from './axios';

export async function verifyTicket(ticket, pid){
  try{
    const response = await axiosDo.post('/verify-ticket', {ticket, pid})
    return response
  }catch(err){
    return err.response
  }
}