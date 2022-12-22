import axiosDo from './axios'

export async function authenticate(values) {
  try{
    const res = await axiosDo.post('/login', {email: values.email, password: values.password})
    console.log(res)
    const response = res.data;
    return response
  }catch(err){
    console.log(err)
    return err.response.status
  }
}