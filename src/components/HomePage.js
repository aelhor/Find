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
    const [answer, setAnswer] = useState('')

    const answerQuestion = async (quesId, e)=> { 
      // send a patch req to the server to answer this ques 
      e.preventDefault()
        try {
          const res = await axios({
            method: 'Patch',
            url: 'https://chiedimi.herokuapp.com/questions/answer/' + quesId,
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
            url : 'https://chiedimi.herokuapp.com/questions/delete/' + quesId ,
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

    // need to fetch  user's questions 
    useEffect(()=> { 
     getAllQuestion(activeUserId,setQuestions )
    }, [])
        
    return <div className='homepage-container'>
       <h1>GOSSIP -_-</h1>
      <img className='homepage-img' alt = 'homepage' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSoA7sqDWhOZp9DnsDsF7-K1CJQftvEOd8gw&usqp=CAU'/>
       {logedIn  ?
       <div>
         <h1>{activeUserName}</h1>
         <h3 title='I have time to kill'>Ask me !</h3>
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
 