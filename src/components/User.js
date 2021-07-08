import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from 'js-cookie'
import Question from './Question'

import {getAllQuestion, likeOrDislike, askQuestion} from '../functions/quesFunction' 

const User = (props)=> { 
    const [user, setUser] = useState({})
    const [quesBody ,setQuesBody] = useState('')
    const [questions, setQuestions] = useState([]) 
    const userId = props.match.params.id               // target user
    const activeUserId = localStorage.getItem('userId')
    const activeUserName = localStorage.getItem('activeUserName')
    const  [active_is_follower, set_Active_is_follower] = useState(false)
  
    useEffect(()=> { 
        // get the user's info 
        const getUserInfo =async ()=> {
            try {
                let res = await axios({
                    method : 'GET',
                    url : 'https://chiedimi.herokuapp.com/users/' + userId,
                    headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
                })
                console.log('user  :', res.data.user);
                setUser(res.data.user)
                // check if acive user is already a follower  
                for(let i = 0 ; i < res.data.user.followers.length ; i++){
                    if(activeUserId === res.data.user.followers[i].userId ){
                        set_Active_is_follower(true)
                        document.querySelector('.follow-btn').classList.add('true-follow')
                        console.log('active is a follower')
                        break
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        getUserInfo()
        // get all usre's questions
        getAllQuestion(userId, setQuestions)

    }, [])

    

    const followOrunFollow = ()=> { 
        // follow
        ! active_is_follower ? 
            axios({
                method: 'Post',
                url: 'https://chiedimi.herokuapp.com/users/follow/' + activeUserId,
                headers : {Authorization : `Bearer ${cookie.get('jwt')}` },
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
                url: 'https://chiedimi.herokuapp.com/users/unfollow/' + activeUserId,
                headers : {Authorization : `Bearer ${cookie.get('jwt')}` },
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
  
    return<>
        <div>
            <h1> {user ?user.userName : 'Null' }  </h1>
            <button onClick={()=>followOrunFollow()} className ={active_is_follower ? 'true-follow':'follow-btn'}>
             { active_is_follower ? 'UNFOLLOW': 'FOLLOW'}
            </button>
        </div>
       <br></br>
       <form className='ques_form' onSubmit = {(e)=>askQuestion(userId, e, quesBody ,setQuesBody)}>
            < textarea
                rows="4" 
                value ={quesBody}
                onChange={(e)=> setQuesBody(e.target.value)}
                required = {true}
                placeholder = 'Ask a question ...'
                className = 'ques-input'
                min={2}
            />
            <button className='answer-btn'> <i className="material-icons">send</i> </button>
        </form>
            {
                questions.length > 0 ?
                    questions.map((ques, i)=> { 
                        return <div key={ ques._id}> 
                            <Question 
                                createdAt = {ques.createdAt}
                                id = {ques._id}
                                body = {ques.body}
                                answer = {ques.answer}
                                likes = {ques.likes}
                                i = {i}
                                page = {'userPage'}
                                likeOrDislike = {()=>likeOrDislike(userId, ques._id, i, setQuestions)}
                            /> 
                        </div>
                    })
                :
                    <p> looading ... </p>
            }
            
    </>
}
export default User