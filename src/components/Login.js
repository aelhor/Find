import React, { useState, useContext } from 'react'
import axios from 'axios'
import cookie from 'js-cookie'
import { userContext } from '../context'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'


const Login = (props) => { 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError ] = useState('')    
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
                },
            })
//             console.log('res : ', res) 
            localStorage.setItem('userId', res.data.id)
            localStorage.setItem('activeUserName', res.data.userName)
            cookie.set('jwt', res.data.token)
            setLogedIn(true)
            setactiveUserId(res.data.id)
            props.history.push('/') 
        } catch (error) {
            console.log(error)
            setLoginError(error.message)
        }
    }
    const responseFacebook = async(response) => {
        const {accessToken, userID, email, name ,picture} = response
        console.log('client side response : ' , response)
        try {
            const res = await axios({
                method : 'POST', 
                url : 'http://localhost:8000/facebookLogin', 
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
        <>
            <div className='form-container'>  
                {
                    !logedIn ? 
                    <div>
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
                            <button>Log In</button>
                    </form> 
                        <FacebookLogin
                        appId="5681515568585713"
                        // autoLoad={true}
                        fields="name,email,picture, birthday"
                        callback={responseFacebook}
                        render={renderProps => (
                            <button className="fb_btn" onClick={renderProps.onClick}> Login With Facebook</button>
                        )}
                        />
                    <p>don't have acccount ? <a href='/signup'> create one </a></p>

                </div>    
                : <h3>You are loged in </h3>
                }
                
                {
                    loginError && <p style={{'color' : '#f00'}}> Invalid e-mail or password</p>
                }
            </div>
        </>
    )
}

export default Login
