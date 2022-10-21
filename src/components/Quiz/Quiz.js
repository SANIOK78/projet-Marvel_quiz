import React, { Component } from 'react';
// import "react-toastify" + le style
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';
import { QuizMarvel } from '../quizMarvel/questions';
import Levels from '../Levels/Levels';
import ProgressBar from '../ProgressBar/ProgressBar';
import QuizOver from '../QuizOver/QuizOver'
// import icone chervron 
import { FaChevronRight } from 'react-icons/fa'

// configuration du "react-toastify"
toast.configure();

const initialState = {
    quizLevel: 0,      //on se base sur lui pour passer au niveau suivant
    maxQuestions: 10,      //pour dire qu'on a 10 question au max
    storedQuestions: [],   //propriété qui va stoquer les questions
    question: null,        // qué la question
    optionsResponse: [],    // les options des réponses
    idQuestion: 0,        //propriété qu'on va utiliser pour incrementer de 
                    //manier dynamique le passage d'une question a l'autre
    btnDisabled: true,  //au démarage le bouton "Suivante" sera desactivé
    userReponse: null,   //va répresenter la reponse chosit par l'utilisateur
    score: 0,          //valeur qu'on va incrementer pour chaque bonne reponse
    msgBenvenu: false,  //va gérer l'aparition du message de "bienvenue"
    quizEnd: false,      //va gérer la fin de questionaire d'un niveau
    percent: null,           //pour gerer le pourcentage de réusite
}

const levelNames = ["debutant", "confirme", "expert"]

class Quiz extends Component {

    constructor(props){
        super(props)
       
        this.state = initialState;
        this.storedDataRef = React.createRef();
    }
    
    loadQuestions = (level) => {
        // On cible les question du niveau "debutant" pour les récupérer
        const fetchedArrayQuiz = QuizMarvel[0].quizz[level]
        // Il faut s'assurer qu'on a bien 10 questions dans ce niveau
        if(fetchedArrayQuiz.length >= this.state.maxQuestions ) {

            // Récupe dans ".current" le tableau des questions et les réponses
            this.storedDataRef.current = fetchedArrayQuiz;

            const optionsQuestions = fetchedArrayQuiz.map(({answer, ...keepRest}) => keepRest);

            this.setState({storedQuestions: optionsQuestions})                            
        } 
    }

    // function qui va afficher la notification de "bienvenu"
    affichageMsgBienvenue = (pseudo) => {

        if(!this.state.msgBenvenu) {

            this.setState({ msgBenvenu: true });
               
            toast.warn(`Bienvenue ${pseudo} ! Bonne chance!`, {
                position: "top-right",     //va s'afficher en haut-droite
                autoClose: 3000,           //pendant 3 sec
                hideProgressBar: false,    // on garde la barre de progression
                closeOnClick: true,        //pour retirer la notification au click
                pauseOnHover: true,        //mise en pose avec souris dessus pour lire le message
                draggable: false,
                bodyClassName : "warning-color"  
            });
        }       
    }

    componentDidMount() {
        // Cibler le State
        this.loadQuestions(levelNames[this.state.quizLevel])
    }

    // fonction permettant de passer a la question suivante. 
    nextQuestion = () => {
        if(this.state.idQuestion === this.state.maxQuestions - 1 ) { 

            // on fait la mise a jour du state
            this.setState({quizEnd: true }) 
                   
        } else {
          
            this.setState(prevSate => ({ idQuestion: prevSate.idQuestion + 1}))            
        }

        // Comparer la reponse saisit par User avec la bonne réponse du Tab 
        const bonneReponse = this.storedDataRef.current[this.state.idQuestion].answer ;

        if(this.state.userReponse === bonneReponse ) {

            this.setState(prevSate => ({ score: prevSate.score + 1 }))
                     
            // Notification pour la bonne reponse
            toast.success('Bravo : +1 point', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                bodyClassName : "toastify-color"    //class configuré dans App.css
            });
        } else {   

            toast.error('Pérdu : +0 point', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,              
            });
        }
    }

    // CYCLE de vie: Mise a jour du composant
    componentDidUpdate(prevProps, prevSate) {

        // Le destructuring: on créer nos diferantes variable a partir de State
        const {storedQuestions, idQuestion, quizEnd, maxQuestions, score } = this.state

        // Si on a nos questions dans le State  et qu'il n'est pas vide
        if((storedQuestions !== prevSate.storedQuestions) && (storedQuestions.length)) {  
                            
            this.setState({
                question: storedQuestions[idQuestion].question, 
                optionsResponse: storedQuestions[idQuestion].options
            })
        }

        if((idQuestion !== prevSate.idQuestion) && (storedQuestions.length) ) {   
                           
            // s'il y a une mise a jour dans State, on va passer a la question suivante
            this.setState({
                question: storedQuestions[idQuestion].question, 
                optionsResponse: storedQuestions[idQuestion].options,
                userReponse: null,
                btnDisabled: true
            })
        }

        if (quizEnd !== prevSate.quizEnd) {   //donc, il y a une modif
            
            const gradePercent = this.getPercentage(maxQuestions, score);

            this.gameOver(gradePercent);
        }

        if(this.props.user.pseudo !== prevProps.user.pseudo) {
            this.affichageMsgBienvenue(this.props.user.pseudo)
        }
    }

    // Modif le State de "btnDisabled: false"
    submitAnswer = (selectReponse) => {
        this.setState({
            userReponse: selectReponse,   
            btnDisabled : false   
        })
    }

    // Méthode pour obtenir le pourcentage de reussite. 
    getPercentage = (maxQuest, ourScore) => {
        
        return (ourScore / maxQuest) * 100 ;
    }

    // Fonction permettant de mettre a jour le State "percent"
    gameOver = (percent) => {

        if(percent >= 50) {
            //on se base sur "quizLevel: 0 " pour passer au niveau suivant
            this.setState({
                quizLevel: this.state.quizLevel + 1,   
                percent: percent
            })

        } else {   //on n'a pas la moyenne: 
            this.setState({ 
                percent: percent  
            })
        }
    }

    // Mis a jour le state et recharger 
    //les questions de niveau suivant
    loadLevelQestion = (param) => {
        this.setState({
            ...initialState,
            quizLevel : param
        })

        // Et on invoque la méthode pour recharger les questions
        this.loadQuestions(levelNames[param]) 
    }

    render() {

        // Le destructuring: on créer nos diferantes variable a partir de State
        const {
            quizLevel,  
            maxQuestions,
            question,
            optionsResponse,
            idQuestion,                       
            btnDisabled,
            userReponse,
            score,
            percent,
        } = this.state  
     
        const displayOptionsReponse = optionsResponse.map((reponse, index) => {
            // "selected" => class.css qui va mettre couleur du fod en rouge et text en Maj
            // Mais on va faire une condition pour avoir se style seulement sur le <p> cické 
            return (
                <p key={index} 
                    // On va se baser sur la reponse d'utilisateur
                    className={`answerOptions ${userReponse === reponse ? "selected" : null} `} 
                    onClick={() => this.submitAnswer(reponse)}
                >
                    <FaChevronRight />  {reponse}
                </p>
            )
        })

        // Condition qui permetra de basculer sur le composant <QuizOver/> 
        // une fois que le niveau a été terminé
        return this.state.quizEnd ? (

            <QuizOver 
                ref={this.storedDataRef}
                levelName={levelNames} //(debutant, confirme, expert)
                score={score}
                maxQuestions={maxQuestions}
                quizLevel={quizLevel}
                percent= {percent}
                loadLevelQestion={this.loadLevelQestion}
            />
            
            ) : (

            <>
                <Levels
                    levelNames={levelNames}
                    quizLevel={quizLevel} 
                />

                <ProgressBar 
                    idQuestion={idQuestion} 
                    maxQuestions={maxQuestions}
                /> 

                <h2>{question}</h2>
                {displayOptionsReponse}
            
                <button onClick={this.nextQuestion}
                    className='btnSubmit' 
                    disabled={btnDisabled}
                >                 
                    {idQuestion < maxQuestions - 1 ? "Suivant" : "Terminer"} 
               
                </button>
            </>
        )    
    }    
};
export default Quiz;