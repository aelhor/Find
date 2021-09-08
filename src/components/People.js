import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from 'js-cookie'
import Search from './Search'


const People = (props)=> { 
    const [users, setUsers] = useState([])
    const activeUserId = localStorage.getItem('userId')
    const [loaded , setLoaded] = useState(false)
    const [usersError , setUsersError] = useState(false)
    
    useEffect(()=> { 
        // get all the users 
        const getAllUser = async () => {
            try {
                let res = await axios({
                    method : 'GET', 
                    url:'https://asky-chidemi.herokuapp.com/users',
                    headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
                })
                console.log(res.data)
                setUsers(res.data.users.filter(user => user._id !== activeUserId))
                console.log('res loaded :',loaded)
                setLoaded(true)
            } catch (error) {
                console.log(error);
                setUsersError(true)
            }
        }
        getAllUser()
    }, [])
   
    return<div className='friends-container'>{console.log('usersError: ',usersError)}
        <Search />    <br/>     
        {!usersError ?
            loaded?
                <ul>
                    {users.map(user=>{
                        return  <li className = 'user_people' key={user._id}>
                                    {
                                        user.fbPicture == 'none' || !user.fbPicture ?  <svg alt='no img ' style={{height : '2rem'}} xmlns="http://www.w3.org/2000/svg"  aria-hidden="true" focusable="false" data-prefix="far" data-icon="user" className="svg-inline--fa fa-user fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"/></svg>
                                        : 
                                        <img style={{height : '2rem' , width : '2rem'}} alt='Img' className='fb_img' src= { user.fbPicture}/>
                                    }
                                    <a className='user-link' href = {`/user/`+ user._id} > {user.userName}</a> <br/>
                                </li>
                    })  }
                </ul>
            :<p className='loading'>Loading...</p> 
         :<p className='error'>something went Wrong</p>
        }
    </div>
}
export default People