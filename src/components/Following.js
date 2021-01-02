import React, { useEffect, useState } from "react";
import axios from "axios";

const Following = (props)=> { 
    const [following, setFollowing] = useState([])
    const [error, setError] = useState(false)


    const activeUserId = localStorage.getItem('userId')


    useEffect(()=> { 
        axios.get('https://chiedimi.herokuapp.com/users/'+activeUserId)
        .then(res=> {
            // // console.log('Following : ',res.data.user.following); // array of objs
            setFollowing(res.data.user.following)

            // fetch the username of the foolowing IDs
           
           
        })
        .catch(error=> { 
            setError(true)
            // console.log(error);
        })
    }, [activeUserId])
   

    return<div className='friends-container'>
        
        {error ? <h3>Somthing went wrong</h3>:
            following.length > 0?
                following.filter(foll=>foll._id !== activeUserId).map(foll=> { 
                    return <li className = 'user' key={foll.userId}>
                                <a className='user-link' href = {`/user/`+ foll.userId} > {foll.userName}</a> <br/>
                            </li>
                }):
            <div>You don't follow anyone yet ...</div>
        }
    </div>
}
export default Following
