import React from 'react'


const closeDatails = ()=> { 
    const QuesLikes = document.querySelector('.ques_datails_container')
    QuesLikes.style.display = "none";
    document.querySelector('body').style.overflow = 'auto'

}
const QuestionDatails = ()=> { 

    return <div className='ques_datails_container'> 
        <button onClick={closeDatails}>x</button>
        <h4>Liked by</h4>
        <div className='ques_datails'></div>
    </div>
} 

export default QuestionDatails