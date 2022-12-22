import axiosDo from './axios';

async function sendCode(phone, email, cpf){
    try{
        const response = await axiosDo.post('/sendCode', {phone: phone, email: email, cpf: cpf})
        return response.status
    }catch(err){
        console.log(err.response.data)
        return err.response.data
    }
}

export default sendCode;