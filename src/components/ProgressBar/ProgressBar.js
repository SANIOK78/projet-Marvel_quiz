import React from 'react';

// on va récupérer des props envoyés depuis "Quiz"
const ProgressBar = ({idQuestion, maxQuestions}) => {

    const getAvancement = (totalQuestions, questionId) => {

        return ( 100 / totalQuestions) * questionId;
    }

    // La question sur laquelle on se trouve
    const actualQuestion = (idQuestion + 1)

    const progressPercent = getAvancement(maxQuestions, actualQuestion)
  
    return (
        <>
            <div className='percentage'>
                <div className="progressPercent">
                    {`Question : ${actualQuestion}/${maxQuestions}`}
                </div>
                
                <div className="progressPercent">
                    {`Progression : ${progressPercent}%`}
                </div>
            </div>

            <div className="progressBar">
                <div 
                    className="progressBarChange" 
                    style={{width: `${progressPercent}%`}}
                ></div>                
            </div>
        </>
    );
};

// React.memo() évite que la fonction se recharge
// a chaque modification de state
export default React.memo(ProgressBar);