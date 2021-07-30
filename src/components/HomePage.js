import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import cookie from 'js-cookie'

import { userContext } from '../context'
import Question from './Question'
import {getAllQuestion, likeOrDislike} from '../functions/quesFunction' 

const HomePage = () => { 
  const {logedIn} = useContext(userContext) 
  // const {activeUserId} = useContext(userContext)
  const activeUserId  = localStorage.getItem('userId')
  const activeUserName = localStorage.getItem('activeUserName')
  const [questions, setQuestions] = useState([]) 
  const [activeUser, setActiveUser] = useState({})

  const [answer, setAnswer] = useState('')

  const answerQuestion = async (quesId, e)=> { 
    // send a patch req to the server to answer this ques 
    e.preventDefault()
      try {
        const res = await axios({
          method: 'Patch',
          url: 'https://asky-chidemi.herokuapp.com/questions/answer/' + quesId,
          data: {
            answer : answer
          }, 
          headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
        })
        console.log(res);
        getAllQuestion(activeUserId,setQuestions)
      } 
      catch (error) {
        console.log(error);
      }
  }
  const deleteQuestion = async(quesId)=>{
    if (window.confirm('delete this question ? ')) {
      try {
        const res = await axios({
          method :'delete',
          url : 'https://asky-chidemi.herokuapp.com/questions/delete/' + quesId ,
          headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
        })
        console.log('question deleted : ', res)
        const newQuestions =  questions.filter(ques => ques._id !== quesId)
        setQuestions(newQuestions)
      } 
      catch (error) {
        console.log('delete questions Error : ',  error);
      }
    }
  }
  const getUserInfo =async (userId)=> {
    try {
        let res = await axios({
            method : 'GET',
            url : 'https://asky-chidemi.herokuapp.com/users/' + userId,
            headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
        })
        console.log('user  :', res.data.user);
        setActiveUser(res.data.user)
    } catch (error) {
        console.log(error);
    }
}

  // need to fetch  user's questions 
  useEffect(()=> { 
    if (logedIn) { 
      getUserInfo(activeUserId) 
      getAllQuestion(activeUserId,setQuestions ) 
    }
    else 
        window.location.replace("/login");
  }, [activeUserId])
  
  return <div className='homepage-container'>
      {
        activeUser.fbPicture == 'none' || !activeUser.fbPicture ?  <svg style={{height : '4rem'}} xmlns="http://www.w3.org/2000/svg"  aria-hidden="true" focusable="false" data-prefix="far" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"/></svg>
        : 
        <img alt='FB Img' className='fb_img' src= { activeUser.fbPicture}/>
      }

       {logedIn  ?
       <div>
         <h1>{activeUserName}</h1>
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
                        page = {'homePage'}
                        deleteQuestion = {()=>deleteQuestion(ques._id)}
                        likeOrDislike = {()=>likeOrDislike(activeUserId, ques._id, i, setQuestions)}
                        answerQuestion = {(e)=>answerQuestion(ques._id, e)}
                        setAnswer = {setAnswer}                     
                      /> 
               </div>
           })
           : <div>No Questions Yet ... </div>
         }
       </div>: 
       <p>Please <a href='/login'>Login</a> First ...</p>
       }
    </div>
}

 export default HomePage
 