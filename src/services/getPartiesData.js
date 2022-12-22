import axiosDo from './axios'
export async function fetchPartiesData(){
  try {
    const response = await axiosDo.get('/parties');
    const res = response.data.parties
    return res
  }catch(err){
    return err.response
  }
}

export async function getUserParties(uid){
  try{
    const response = await axiosDo.post('/user-parties', {uid})
    console.log(response.data)
    return response.data.parties
  }catch(err){
    return err.response
  }
}