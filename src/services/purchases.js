import axiosDo from './axios';

export async function purchaseTicket(pid){
  try{
    const response = await axiosDo.post('/purchase-ticket-test', {pid})
    return response
  }catch(err){
    return err.response
  }
}

export async function getBuyers(pid, inside){
  try{
    const response = await axiosDo.post('/get-buyers', {pid, inside})
    return response
  }catch(err){
    return err.response
  }
}

export async function acceptUserInParty(pid, uid){
  try{
    const response = await axiosDo.post('/accept-user-in-party', {pid, uid})
    return response
  }catch(err){
    return err.response
  }
}

export async function removeUserFromParty(pid, uid){
  try{
    const response = await axiosDo.post('/remove-user-from-party', {pid, uid})
    return response
  }catch(err){
    return err.response
  }
}