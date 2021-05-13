import React, { useState, useContext } from 'react'
import axios from 'axios'
// import cookie from 'js-cookie'
import { userContext } from '../context'

const Login = (props) => { 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError ] = useState(false)
    
    const {logedIn, setLogedIn} = useContext(userContext)
    const {setactiveUserId} = useContext(userContext)

    
    const login = async (e)=>  {
        e.preventDefault()
        try {  
            const res = await axios({
                method : "POST",
                url : 'https://chiedimi.herokuapp.com/login', 
                data : {
                    email : email , 
                    password : password,
                }
            })
            console.log('res : ', res) 
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('userId', res.data.id)
            localStorage.setItem('activeUserName', res.data.userName)//userName is not in the response
            setLogedIn(true)
            setactiveUserId(res.data.id)
            props.history.push('/') 
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>
            <div className='form-container'>  
                {
                    !logedIn ? 
                    <form onSubmit = {login}>
                        <label > E-mail :</label> 
                        <input 
                            type='email' 
                            name = 'email' 
                            value ={email} 
                            required
                            placeholder='Enter your email'
                            onChange = {e=> setEmail(e.target.value)}
                        /><br/>
                        <label >  Password : </label> 
        
                        <input 
                            type='password' 
                            name = 'password'
                            value ={password} 
                            min = '8'
                            required
                            placeholder='Enter your password'
                            onChange = {e=> setPassword(e.target.value)}
                            /><br/>
                        <button>log In</button>
                </form> : <h3>You are loged in </h3>
                }
                
                {
                    loginError && <p> Invalid e-mail or password</p>
                }
            </div>
        </>
    )
}

export default Login