import axiosDo from './axios';

async function getUserNameAndPicture(uid) {
    try {
        const response = await axiosDo.post('users/name-and-picture', {uid: uid});
        return response.data.user
    }catch(err){
        return err.response;
    } 
}

export async function getUserSocials(uid) {
    try {
        const response = await axiosDo.post('/users/socials', {uid: uid});
        return response.data.socials
    }catch(err){
        return err.response;
    }
}

export async function updateUserInfo(changes) {
    try {
        const response = await axiosDo.post('/update-user', {changes})
        return response.status
    }catch(err) {
        console.log(err.response.status)
        return err.response
    }
}

export async function uploadProfilePicture(data){
    try {
        const response = await axiosDo.post('/upload-profile-picture', data)
        return response
    }catch(err){
        console.log(err)
        return err.response
    }
}

export async function changeUserPassword(actualPassword, newPassword){
    try{
      const response = await axiosDo.post('/change-user-password', {actualPassword, newPassword})
      console.log('consegui em cima')
      return response.status
    }catch(err){
      console.log(err.response.status)
      console.log('to embaixo')
      return err.response
    }
}

export async function getUserTickets(){
  try{
    const response = await axiosDo.get('/get-user-tickets')
    return response
  }catch(err){
    return err.response
  }
}
export default getUserNameAndPicture;