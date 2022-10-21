import React, {useState} from 'react';
// import function pour creer un utilisateur
import { createUserWithEmailAndPassword} from 'firebase/auth';
// import  {auth} et la configuration de "user"
import  { auth, user } from '../Firebase/fiebaseConfig';
// import méthode "setDoc" qui va permettre de mettre a jour le
// le "document"
import { setDoc } from 'firebase/firestore';
import { Link, useNavigate} from 'react-router-dom';

const Signup = (props) => {

    const navigate = useNavigate();

    // Création d'un objet qui va contenir tous les element de formulaire
    // et on va la mettre en tant que valeur initiale dans le State
    const data = {
        pseudo: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    const [loginData, setLoginData] = useState(data);
    const [error, setError] = useState('');  

    const handleChange = (e) => {   //on cible tous les élements avec un ID
       setLoginData({...loginData, [e.target.id] : e.target.value });
    }

    // function permettant la summision du formulaire
    const handleSubmit = (e) => {
        e.preventDefault() ;    //empechement rechargement de la page
        // extraction des elements via destructuring
        const {email, password, pseudo} = loginData;

        createUserWithEmailAndPassword(auth, email, password)
        .then( authUser => {
            console.log(authUser)
            return setDoc(user(authUser.user.uid), {
                pseudo: pseudo,
                email: email
            } )            
        })
        .then(() => {
            setLoginData({...data});  // vider le formulaire apres l'envois 
            // Ensuite redirection de user vers la page Welcome
           navigate("/welcome");
        })
        .catch(error => {
            setError(error);
            setLoginData({...data});
        })
    }

    // On va faire du destructuring sur nos state(variable d'état)
    const { pseudo, email, password, confirmPassword } = loginData;

    const btn = pseudo === "" || email === "" || password === "" || password !== confirmPassword 
    ? <button disabled>Inscription</button> : <button >Inscription</button>

    // Géstion des erreurs
    const errorMsg = error !== "" && <span>{error.message}</span>;

    return (
        <div className='signUpLoginBox'>
            <div className="slContainer">
             {/* Partie gauche avec bg-image */}
                <div className="formBoxLeftSignup">  </div> 

             {/* Partie droite avec le form d'inscription */}
                <div className="formBoxRight">
                    <div className="formContent">
                        
                        {/* Afichage erreur s'il y a  */}
                        {errorMsg}

                        <h2>Inscription</h2>

                        <form action="" onSubmit={handleSubmit}>

                            <div className="inputBox">
                              {/* Evenement "onChange" va permettre la capture des valeur des inputs */}
                                <input onChange={handleChange} value={pseudo}
                                    type="text" id='pseudo' autoComplete='off' required                                        
                                />
                                <label htmlFor="pseudo">Pseudo</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={email}
                                    type="email" id='email' autoComplete='off' required                                    
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={password}
                                    type="password" id='password' autoComplete='off' required                                        
                                />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={confirmPassword}
                                    type="password" id='confirmPassword' autoComplete='off' required                                        
                                />
                                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                            </div>

                            {btn}
                        </form>

                        {/*  lien vers la page de connexion */}
                        <div className="linkContainer">
                            <Link className='simpleLink' to="/login">Déjà inscrit ? Connectez-vous</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;