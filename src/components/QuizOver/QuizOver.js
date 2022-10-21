import React, { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import { GiTrophyCup } from "react-icons/gi"
import Modal from '../Modale/Modal';
import axios from 'axios'

const QuizOver = React.forwardRef((props, ref) => {

    // récupération des props via destructuring
    const {levelName, score, maxQuestions, quizLevel, percent, loadLevelQestion} = props;

    // Récupération de la "KEY_Public" de l'API Marvel
    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY

    // Récupération du "hash" qui contient : ts + clePrivat + clePublic
    const hash = '6490c802cc5017590670f97bab831a99';

    // State qui va enregistrer les modifs effectué dans "ref.current"
    const[dataTab, setDataTab] = useState([]);
    const[openModal, setOpenModal] = useState(false)
    // State qui va stoquer le résultat obtenu depuis l'API Marvel
    const [infoPersonnage, setInfoPersonnage] = useState([]);
    // State pour gerer le chargement des Data concernant le Personnage
    const [loadingInfo, setLoadingInfo] = useState(true);

    // Rénouveler tous les 15 jours les requêtes
    // vers l'API pour avoir des Data mise a jour. 
    useEffect(() => {
        setDataTab(ref.current)

        if( localStorage.getItem('marvelStorageDate')) {

            const date = localStorage.getItem('marvelStorageDate')
            // on va verifier l'age de la Data
            checkDateAge(date)
        }

    }, [ref]) 
    
    const checkDateAge = (date) => {
        const today = Date.now();
   
        const timeDifferance = today - date;
        
        // On calcule en jours (1000ms * 3600s/heure * 24h/jour)
        const dayDifferance = timeDifferance / (1000 * 3600 * 24)

        if(dayDifferance >= 15 ) {     
            // On va netoyer le "localStorage"
            localStorage.clear();

            // On met en place une nouvelle DATE 
            localStorage.setItem('marvelStorageDate', Date.now()) ;
        }
    }

    // Fonction permettant d'afficher la Modale 
    const afficheModal = (id) => {

        setOpenModal(true)

        // Condition pour savoir si on a déjà dans "localStorage" les infos récherché
        // On va se baser sur l'ID du personnage 
        if ( localStorage.getItem(id) ) {   //si "true" = on a cette info enregistré déjà

            // Mise a jour du State avec les infos existantes dans "localStorage"
            setInfoPersonnage(JSON.parse(localStorage.getItem(id)));

            // On met en false le "loaderInfo" pour autoriser l'affichage dans Modal
            setLoadingInfo(false)

        } else {   //on fait apel a "axios"

            // Le URL  pour faire des requ^tes 
            axios 
            .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`)
            .then((response) => {
                
                // Enreistrement des infos obtenu dans le State
                setInfoPersonnage(response.data)
                setLoadingInfo(false)

                // Enregistrement d'une copie dans "localStorage"
                localStorage.setItem(id, JSON.stringify(response.data))

                // Création de la DATE de cette copie dans "localStorage"
                if( !localStorage.getItem('marvelStorageDate')) {    //si cette key n'existe pas
                    // on va la créer
                    localStorage.setItem('marvelStorageDate', Date.now())
                }
                
                // Date.now() = le temps, en seconde, écoulé depuis 01.01.1970
            })
            .catch(err => console.log(err))
        } 
    }

    // Fonction permettant de fermer la Modal
    const fermerModal = () => {
        setOpenModal(false)

        // On remet a l'état initiale la Modal
        setLoadingInfo(true)
    }

    // Méthode pour mettre la premier lettre en Maj
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1) ;
    }

    // la moyenne
    const moyenne = maxQuestions / 2 ;

    // Condition qui va gerer le cas ou on n'a pas la moyenne
    if(score < moyenne) {

        // On peut choisir de recharger que le niveau raté
        setTimeout(() =>  loadLevelQestion(quizLevel), 3000);
    }
    // Condition pour afficher les cas suivantes:
    const decision = score >= moyenne ? (      // 1. ON A LA MOYENNE :
        <>
            <div className='stepsBtnContainer'>
                {
                    quizLevel < levelName.length ?    //si on est sur ["debut", "confirm", "expert"]
                    (        
                        // MAIS : Quiz pas terminé, on n'a pas encore validé le dernier niveau
                        <>
                            <p className="successMsg">Bravo, passez au niveau suivant ! </p>
                        
                            <button className="btnResult success"
                                onClick={() => loadLevelQestion(quizLevel) }  //suite a ça on passe au niveau suivant
                            >
                                Niveau Suivant
                            </button>
                        </>

                    ) :  (   

                        // ET : Quiz terminé, on a validé le dernier niveau  du Tab = "expert"                       
                        <>
                            <p className="successMsg">
                              {/* On va tiliser ici une icone personnalisé + style */}
                                <GiTrophyCup size='50px'/> Bravo, vous êtes un expert !
                            </p>
                          {/* On va invoquer la méthode "loadLevelQestion(0)". Vu qu'on est au dérnier niveau, on va
                          révenir a létape initiale */}
                            <button className="btnResult gameOver"
                                onClick={() => loadLevelQestion(0) }

                            > Accueil</button>
                        </>
                    )
                } 
            </div>

            <div className="percentage">
                <div className="progressPercent"> Réussite : {percent}% </div>
                <div className="progressPercent"> Note : {score}/{maxQuestions} </div>
            </div>           
        </>       
    )
    :     
    (     // 2. ON N'A PAS LA MOYENNE
        <>
            <div className='stepsBtnContainer'>
                <p className="failureMsg"> Vous avez échoué ! </p>
            </div>

            <div className="percentage">
                <div className="progressPercent"> Réussite : {percent}% </div>
                <div className="progressPercent"> Note : {score}/{maxQuestions} </div>
            </div>
        </>
    )
    // On met en place une condition qui va permettre d'afficher le tab 
    // avec questions et reponse, seulement si on a la moyenne en apliquant 
    // la méthode "map()" sur les données récupérer
    const affichDataTab = score >= moyenne ? (
        dataTab.map( infos => {
            return (
                <tr key={infos.id}>
                    <td>{infos.question}</td>
                    <td>{infos.answer}</td>

                    <td>
                        <button 
                            className="btnInfo"
                            onClick={() => afficheModal(infos.heroId) }
                        > 
                            Infos
                        </button>
                    </td>
                </tr>
            )
        })

    ) : (
        // On va gerer le cas ou on n'a pas la moyenne
        <tr>
            <td colSpan="3">
             {/* On affiche un loader */}
                <Loader 
                    loadingMsg={"Pas de réponse !"}
                    styling={{textAlign:'center', color:'red'}}                   
                />
            </td>
        </tr>
    )
    
    // La logique pour afficher le résultat dans notre Modal
    // Si "loadingInfo" est false = on a obtenu la réponce et on l'affiche:
    const resultInModal = !loadingInfo ?
    (
        <>
            <div className="modalHeader">
                <h2>{infoPersonnage.data.results[0].name}</h2>
            </div>

            <div className="modalBody">
                <div className="comicImage">
                    <img 
                        src={infoPersonnage.data.results[0].thumbnail.path+'.'+infoPersonnage.data.results[0].thumbnail.extension} 
                        alt={infoPersonnage.data.results[0].name}       
                    />
                  {/* l'info d'on provient l'image */}
                    <p> { infoPersonnage.attributionText } </p>
                   
                </div>

                <div className="comicDetails">
                    <h3>Description </h3>
                    {     
                        //condition pour savoir si on a une description...
                        infoPersonnage.data.results[0].description ? 
                            <p>{infoPersonnage.data.results[0].description} </p>
                        :
                            <p>Description indisponible...</p>
                    }

                    <h3>Plus d'infos</h3>
                    {/* Ici on va afficher les trois bouton presant dans "data.results[0].urls[]" */}
                    {
                        // Condition : seulement s'il existe je l'affiche. Vu que c'est un tab on pass par "map()"
                        infoPersonnage.data.results[0].urls &&   
                        infoPersonnage.data.results[0].urls.map((url, index) => {

                            return <a key={index} href={url.url} target="_blank" rel="noopener noreferrer"> 
                                {/* Premier lettre en Maj */}
                                { capitalizeFirstLetter(url.type) } 
                            </a>
                        })
                    }

                </div>
            </div>

            <div className="modalFooter">
                <button className='modalBtn' onClick={fermerModal}>Fermer</button>
            </div>
        </>

    ) : (          
        //Si pas des résultat = affichage de <Loader />
        <>
            <div className="modalHeader">
                <h2>Réponse de Marvel...</h2>
            </div>

            <div className="modalBody">
                <Loader />
            </div>
        </>       
    )

    return (
        <>
            { decision }
            <hr />
            <p>Les réponses aux questions posées : </p>

            {/* Le Tableau */}
            <div className="answerContainer">
                <table className="answers">
                    <thead>
                        <tr>
                            <th>Qestions</th>
                            <th>Réponses</th>
                            <th>Infos</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                        {affichDataTab}
                        
                    </tbody>
                </table>
            </div>

            {/* Affichage <Modal /> */}
            <Modal showModal={openModal} closeModal={fermerModal}>
              
                { resultInModal }

            </Modal>

        </>
    );
});

// On va éviter de récharger inutilement le composant grace "react.memo()"
export default React.memo(QuizOver);