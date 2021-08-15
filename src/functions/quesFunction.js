import cookie from 'js-cookie'
import axios from 'axios'
const activeUserName = localStorage.getItem('activeUserName')
const activeUserId  = localStorage.getItem('userId')

// Homepage & user 
export const getAllQuestion = async(userId,setQuestions , setQuestionsError)=> { 
    try {
      const res = await axios({
        method : 'GET', 
        url : 'http://localhost:8000/questions/' + userId,
        headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
      })
      console.log('fetching questions Response : ', res)
      setQuestions(res.data)
      console.log('allQuestion : ',res.data)
    } 
    catch (error) {
      console.log('fetching questions Error : ',  error);
      setQuestionsError(error)
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
            url: 'http://localhost:8000/questions/dislike/'+quesId,
            data :{
                activeUserId : activeUserId,
                activeUserName : activeUserName
            },
            headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
        })
        // too expensive 
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
            url: 'http://localhost:8000/questions/like/'+quesId,
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

