import axiosDo from './axios';

async function sendCodeFP(phone){
    try{
        const response = await axiosDo.post('/sendCode-forgotPassword', {phone: phone})
        return response.status
    }catch(err){
        return err.response.status
    }
}

export default sendCodeFP;