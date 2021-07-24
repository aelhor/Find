import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from 'js-cookie'


const People = (props)=> { 
    const [users, setUsers] = useState([])
    const activeUserId = localStorage.getItem('userId')
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
            } catch (error) {
                console.log(error);
            }
        }
        getAllUser()
    }, [])
   
//   
    return<div className='friends-container'>
        <ul>
        {
            users.map(user=>{
                return  <li className = 'user'key={user._id}>
                            <a className='user-link' href = {`/user/`+ user._id} > {user.userName}</a> <br/>
                        </li>
            })    
        }
        </ul>
    </div>
}
export default People