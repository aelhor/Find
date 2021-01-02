import React, { useEffect, useState } from "react";
import axios from "axios";

const User = (props)=> { 
    const [user, setUser] = useState({})
    const [quesBody ,setQuesBody] = useState('')
    const [questions, setQuestions] = useState([]) 
    const userId = props.match.params.id               // target user
    // const {activeUserId} = useContext(userContext)
    const activeUserId = localStorage.getItem('userId')
    const activeUserName = localStorage.getItem('activeUserName')

    const  [active_is_follower, set_Active_is_follower] = useState(false)

    useEffect(()=> { 
        // get the user's info 
        axios.get('http://localhost:8000/users/' + userId)
        .then(res=> {
            console.log('user  :', res.data.user);
            setUser(res.data.user)
            // check if acive user is already a follower  
            for(let i = 0 ; i < res.data.user.followers.length ; i++){
                if(activeUserId === res.data.user.followers[i].userId ){
                    set_Active_is_follower(true)
                    console.log('active is a follower')
                    break
                }
            }
        })
        .catch(error=> { 
            // console.log(error);
        })
// -------------------------------------------------------------
        // get all usre's questions
        axios.get('http://localhost:8000/questions/' + userId)
        .then(res=> { 
            // // console.log('fetching questions Response : ', res);
            setQuestions(res.data)
        })
        .catch(error=> {
            // // console.log('fetching questions Error : ',  error);
        })

    }, [])

    const askQuestion =(userId, e)=> { 
        e.preventDefault()

        axios({
            method: 'Post',
            url: 'http://localhost:8000/questions/ask/' + userId,
            data: {
              body : quesBody
            }, 
          })
          .then(res=> { 
            // // console.log(res);
            
            // clear the input 
            setQuesBody('')
            // send a sucessful message 
            document.querySelector('.ques-input').classList.add('green')

            // window.location.reload()
          })
          .catch(error=> {
            // console.log(error);
          })
    }

    const followOrunFollow = ()=> { 
        // follow
        ! active_is_follower ? 
            axios({
                method: 'Post',
                url: 'http://localhost:8000/users/follow/' + activeUserId,
                data: {
                    targetId : userId ,// target User Id
                    targetUserName : user.userName,
                    activeUserName : activeUserName
                }, 
            })
            .then(res=> { 
                console.log('Follow response: ', res);
                set_Active_is_follower(true)
                // window.location.reload()
            })
            .catch(error=> {
                console.log(error);
            }) :
            // unFollow
            axios({
                method: 'Post',
                url: 'http://localhost:8000/users/unfollow/' + activeUserId,
                data: {
                    targetId : userId ,// target User Id
                    targetUserName : user.userName,
                    activeUserName : activeUserName
                }, 
            })
            .then(res=> { 
                console.log('Follow response: ', res);
                set_Active_is_follower(false)
            })
            .catch(error=> {
                // console.log(error);
            })
    }
   
    return<div>
       <h1> {user.userName}  </h1>
       {console.log('Active_is_followers', active_is_follower)}
       <button onClick={()=>followOrunFollow()} className = 'follow-btn'>
           { active_is_follower ? 'UNFOLLOW': 'FOLLOW'}
        </button> 
       <br></br>
       <form onSubmit = {(e)=>askQuestion(userId, e)}>
            <input 
                type = 'text'
                value ={quesBody}
                onChange={(e)=> setQuesBody(e.target.value)}
                required = {true}
                placeholder = 'Ask a question ...'
                className = 'ques-input'
                min={2}
            />
            <button >Send</button>
        </form>
            {
                questions.length > 0 ?
                    questions.map(ques=> { 
                        return(
                            ques.answer ? 
                            <div className='question' key = {ques._id}>
                                <div  className='question-body'>{ques.body}</div>
                                 <div className='question-answer'> {ques.answer}</div>
                            </div>:null
                        )
                    })
                :
                    <p>There are no questions for this user</p>
            }
            
    </div>
}
export default User