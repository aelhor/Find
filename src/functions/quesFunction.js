import cookie from 'js-cookie'
import axios from 'axios'
const activeUserName = localStorage.getItem('activeUserName')
const activeUserId  = localStorage.getItem('userId')

// Homepage & user 
export const getAllQuestion = async(userId,setQuestions)=> { 
    try {
      const res = await axios({
        method : 'GET', 
        url : 'https://chiedimi.herokuapp.com/questions/' + userId,
        headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
      })
      console.log('fetching questions Response : ', res)
      setQuestions(res.data)
      console.log('allQuestion : ',res.data)
    } 
    catch (error) {
      console.log('fetching questions Error : ',  error);
    }
} 
export const likeOrDislike = async (userId , quesId, i, setQuestions)=>{
    let activeLikedQues = false
    let loveBtnI = document.querySelector( `.love${i}`)
    if (loveBtnI.classList.contains('loved')){
      activeLikedQues = true
    }
    if (activeLikedQues ){
      try{
        const res = await axios({
            method : 'PATCH', 
            url: 'https://chiedimi.herokuapp.com/questions/dislike/'+quesId,
            data :{
                activeUserId : activeUserId,
                activeUserName : activeUserName
            },
            headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
        })
        getAllQuestion(userId, setQuestions )

      }
      catch(error){
          console.log(error)
      }
    }
    else{
      try{
        const res = await axios({
            method : 'PATCH', 
            url: 'https://chiedimi.herokuapp.com/questions/like/'+quesId,
            data :{
                activeUserId : activeUserId,
                activeUserName : activeUserName
            },
            headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
        })
        getAllQuestion(userId,setQuestions )
      }
      catch(error){
          console.log(error)
      }
    }
}
 
// HomePage
export const answerQuestion = async (quesId, e, answer, setQuestions, activeUserId)=> { 
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
export const deleteQuestion = async(quesId, setQuestions, questions)=>{
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

// user 
export const askQuestion =(userId, e,quesBody ,setQuesBody)=> { 
    e.preventDefault()
    axios({
        method: 'Post',
        url: 'https://chiedimi.herokuapp.com/questions/ask/' + userId,
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
        // setTimeout(() => {
        //     failedNote.classList.add('display_note')
        // }, 2000);
      })
}