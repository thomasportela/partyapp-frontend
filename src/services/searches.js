import axiosDo from './axios';

export async function searchPeople(search){
  try{
    const response = await axiosDo.post('/search-people', {search: search})
    return response.data
  }catch(err){
    return err.response
  }
}

export async function searchParties(search){
  try{
    const response = await axiosDo.post('/search-parties', {search: search})
    return response.data
  }catch(err){
    return err.response
  }
}