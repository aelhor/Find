import React, { useState, useContext } from 'react'
import axios from 'axios'
import { userContext } from '../context'
import cookie from 'js-cookie'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

const Signup = (props) => { 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userName, setUserName] = useState('')
    const [signupError, setSignupError] = useState(false)
    const {logedIn, setLogedIn} = useContext(userContext)
   
    const signUp = async(e)=>  {
        e.preventDefault()
        try { 
            const res = await axios({
                method : "POST",
                url : 'https://asky-chidemi.herokuapp.com/signup', 
                data : {
                    email : email , 
                    password : password,
                    userName : userName
                }
            })
            localStorage.setItem('userId', res.data.newUser.id)
            localStorage.setItem('activeUserName', res.data.newUser.userName)//userName is not in the response
            setLogedIn(true)
            cookie.set('jwt', res.data.newUser.signupToken)
            props.history.push('/') 
            // console.log(res)
        } catch (error) {
            console.log(error, 'user name or email already exist')
            setSignupError(true)
        }
    }
    const responseFacebook = async(response) => {
        const {accessToken, userID, email, name ,picture} = response
        console.log('client side response : ' , response)
        try {
            const res = await axios({
                method : 'POST', 
                url : 'https://asky-chidemi.herokuapp.com/facebookLogin', 
                data : {
                    accessToken : accessToken , 
                    userID : userID , 
                    email : email,
                    name: name, 
                    picture : picture
                }
            })
//             console.log('from server : ', res )
            localStorage.setItem('userId', res.data.newUser.id)
            localStorage.setItem('activeUserName', res.data.newUser.userName)
            cookie.set('jwt', res.data.newUser.signupToken)
            setLogedIn(true)
            props.history.push('/') 

        } catch (error) {
            console.log('fbLogin Error : ', error)
        }
    }

    return(
        <div className='form-container'>  
            {
            !logedIn ? 
            <div>
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
                </form>    
                <p>already have account? <a href='/login'> Log In </a></p>
                <FacebookLogin
                    appId="5681515568585713"
                    // autoLoad={true}
                    fields="name,email,picture, birthday"
                    callback={responseFacebook}
                    render={renderProps => (
                        <button className="fb_btn" onClick={renderProps.onClick}>Login With Facebook</button>
                      )}
                    />
            </div>
            :<h3>you are loged In </h3>
            }
            </div>
    )
}

export default Signup
