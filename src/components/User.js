import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from 'js-cookie'
import Question from './Question'

import {getAllQuestion, likeOrDislike} from '../functions/quesFunction' 

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
                    url : 'https://asky-chidemi.herokuapp.com/users/' + userId,
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

    const askQuestion =(userId, e)=> { 
        e.preventDefault()
        axios({
            method: 'Post',
            url: 'https://asky-chidemi.herokuapp.com/questions/ask/' + userId,
            headers : {Authorization : `Bearer ${cookie.get('jwt')}` },
            data: {
              body : quesBody
            }, 
          })
          .then(res=> {             
            console.log(res)
            // clear the input 
            setQuesBody('')
          })
          .catch(error=> {
            console.log(error);
          })
    }

    const followOrunFollow = ()=> { 
        // follow
        ! active_is_follower ? 
            axios({
                method: 'Post',
                url: 'https://asky-chidemi.herokuapp.com/users/follow/' + activeUserId,
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
                url: 'https://asky-chidemi.herokuapp.com//users/unfollow/' + activeUserId,
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
            {
                user.fbPicture == 'none' || !user.fbPicture ?  <svg style={{height : '4rem'}} xmlns="http://www.w3.org/2000/svg"  aria-hidden="true" focusable="false" data-prefix="far" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"/></svg>
                : 
                <img alt='FB Img' className='fb_img' src= { user.fbPicture}/>
            }
            <h1> {user ?user.userName : 'Null' }  </h1>
            <button onClick={()=>followOrunFollow()} className ={active_is_follower ? 'true-follow':'follow-btn'}>
             { active_is_follower ? 'UNFOLLOW': 'FOLLOW'}
            </button>
        </div>
       <br></br>
       <form className='ques_form' onSubmit = {(e)=>askQuestion(userId, e)}>
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
                    <p> No Questions Yet ... </p>
            }
            
    </>
}
export default User