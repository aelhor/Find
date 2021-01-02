import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { userContext } from '../context'

const getAllQuestion = async(activeUserId,setQuestions)=> { 
  try {
    const res = await axios.get('https://chiedimi.herokuapp.com/questions/' + activeUserId)  
    console.log('fetching questions Response : ', res)
    setQuestions(res.data)
  } 
  catch (error) {
    console.log('fetching questions Error : ',  error);
  }
} 
const HomePage = (props) => { 
    const {logedIn} = useContext(userContext) 
    // const {activeUserId} = useContext(userContext)
    const activeUserId  = localStorage.getItem('userId')
    const activeUserName = localStorage.getItem('activeUserName')

    const [questions, setQuestions] = useState([]) 
    const [answer, setAnswer] = useState('')

    // need to fetch  user's questions 
    useEffect(()=> { 
     getAllQuestion(activeUserId,setQuestions )
    }, [])

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
          })
          console.log(res);
          getAllQuestion(activeUserId,setQuestions)
        } 
        catch (error) {
          console.log(error);
        }
    } 
    return <div>
      <img className='homepage-img' alt = 'homepage' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSoA7sqDWhOZp9DnsDsF7-K1CJQftvEOd8gw&usqp=CAU'/>
       {logedIn ?
       <div>
         <h1>{activeUserName}</h1>
         <h3 title='Chiedimi means ask me in italian'>Ask me  ...</h3>
         {
           questions.map(ques=> {
             return(
               <div key={ ques._id}>
                  {
                    ques.answer ? 
                    <div className='question'>
                      <div className='question-body'>{ques.body}</div>
                      <div className='question-answer'>{ques.answer} </div>
                    </div> : 
                    
                    <div className='question'>
                      <div className='question-body'>{ques.body}</div>
                      <input 
                        type='text' 
                        placeholder='Enter an answer' 
                        name={ques._id}
                        onChange ={e=>{
                          setAnswer(e.target.value) 
                        }}/>

                        <form onSubmit ={(e)=> answerQuestion(ques._id, e)} >
                          <button >Answer</button>
                        </form>
                    </div>
                  }
               </div>
             )
           })
         }
       </div>: 
       <h4>please log in first</h4>
       }
    </div>
}

 export default HomePage
 