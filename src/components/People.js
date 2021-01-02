import React, { useEffect, useState } from "react";
import axios from "axios";

const People = (props)=> { 
    const [users, setUsers] = useState([])
    const activeUserId = localStorage.getItem('activeUserId')


    useEffect(()=> { 
        // get all the users 
        const getAllUser = async () => {
            try {
                let res = await axios.get('https://chiedimi.herokuapp.com/users')
                console.log(res.data)
                setUsers(res.data.users)

            } catch (error) {
                console.log(error);

            }
        }
        getAllUser()
        // axios.get('https://chiedimi.herokuapp.com/users')
        // .then(res=> {
        //     console.log(res.data);
        //     setUsers(res.data.users)
        // })
        // .catch(error=> { 
        //     console.log(error);
        // })
    }, [])
   
//   
    return<div className='friends-container'>
        <ul>
        {
            users.filter(user=> user._id !== activeUserId).map(user=>{
                return  <li className = 'user'key={user._id}>
                            <a className='user-link' href = {`/user/`+ user._id} > {user.userName}</a> <br/>
                        </li>
            })    
        }
        </ul>
    </div>
}
export default People