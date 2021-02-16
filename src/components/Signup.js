import React, { useState, useContext } from 'react'
import axios from 'axios'
import { userContext } from '../context'

const Signup = (props) => { 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userName, setUserName] = useState('')
    const [signupError, setSignupError] = useState(false)

    const {logedIn, setLogedIn} = useContext(userContext)

    const signUp = async(e)=>  {
        e.preventDefault()
        try {  ///        Test This 
            const res = await axios({
                method : "POST",
                url : 'https://chiedimi.herokuapp.com/signup', 
                data : {
                    email : email , 
                    password : password,
                    userName : userName
                }
            })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('userId', res.data.newUser.id)
            localStorage.setItem('activeUserName', res.data.newUser.userName)//userName is not in the response
            setLogedIn(true)
            props.history.push('/') 
        } catch (error) {
            console.log(error, 'user name or email already exist')
            setSignupError(true)
        }
        // axios.post('https://chiedimi.herokuapp.com/signup', {
        //         email : email , 
        //         password : password,
        //         userName : userName
        //     }) 
        // .then(res=>{ 
        //     // // console.log('Response : ',res) //
        //     localStorage.setItem('token', res.data.token)
        //     localStorage.setItem('userId', res.data.newUser.id)
        //     localStorage.setItem('activeUserName', res.data.newUser.userName)// userName is not in the response

        //     setLogedIn(true)
        //     props.history.push('/') 
        // }) 
        
        // .catch(err=>{
        //     // console.log(err)
        // })
        
    }
    return(
        <div className='form-container'>  
            {
            !logedIn ? 
            <form onSubmit = {signUp}>
                <label>E-mail : </label>
                <input 
                    type = 'email' 
                    name = 'email' 
                    value = {email} 
                    required
                    placeholder='Enter an email'
                    onChange = {e=> setEmail(e.target.value)}
                /><br/>
                <label>User Name : </label>
                <input 
                    type='text' 
                    name = 'userName' 
                    value ={userName} 
                    required
                    placeholder='Enter a user name'

                    onChange = {e=> setUserName(e.target.value)}
                /><br/>
                <label>Password :</label> 
                <input 
                    type='password' 
                    name = 'password'
                    value ={password} 
                    required
                    min = '8'
                    placeholder='Enter 8 charcter password'

                    onChange = {e=> setPassword(e.target.value)}
                    /><br/>
                <button>Sign Up</button>
                <small className='message'>{signupError ? 'username or email already exist..let\'s try anain' : null} </small>
            </form> :<h3>you are loged In </h3>
            }
            
                
        </div>
    )
}

export default Signup