import React, {useState, useEffect} from 'react';
// import function Firebase pous se connecter
import { signInWithEmailAndPassword} from 'firebase/auth';
// import  {auth}
import  { auth } from '../Firebase/fiebaseConfig';
// import {Link} + {useNavigate} pour faire une redirection
import {Link, useNavigate} from 'react-router-dom';

const Login = (props) => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [btn, setBtn] = useState(false);
    const [error, setError ] = useState('')

    // gestion btn:
    useEffect(() => {
        // Verification  longueur de password
        if(password.length > 5  && email !== "") {    
            setBtn(true)                            

        } else if (btn === true) {    
            setBtn(false) ;         
        }                        

    }, [password, email, btn])  

    // Sumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        // on passe les données a la "Firebase" pour se connecter
        signInWithEmailAndPassword(auth, email, password)
        .then(user => {
            console.log(user);

            setEmail('');     //pour vider le champ
            setPassword('');
            // Rédirection sur la page "welcome" et on retire la route de l'historique
            navigate('/welcome', {replace: true});   
        })
        .catch(error => {
            setError(error)

            setEmail('');
            setPassword('')
        })
    }
                                
    return (
        <div className='signUpLoginBox'>

            <div className="slContainer">
                
                {/* Partie gauche avec bg-image */}
                <div className="formBoxLeftLogin">  </div> 

                {/* Partie droite avec le form d'inscription */}
                <div className="formBoxRight">
                    <div className="formContent">

                        {/* En cas d'erreur, ici on va l'afficher */}
                        {error !== "" && <span> {error.message }</span>}
            
                        <h2>Connexion</h2>

                        {/* Submit de formulaire */}
                        <form action=""  onSubmit={handleSubmit}>

                            <div className="inputBox">
                                <input onChange={(e) => setEmail(e.target.value)} value={email}
                                    type="email" id='email' autoComplete='off' required                                    
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={(e) => setPassword(e.target.value)} value={password}
                                    type="password" id='password' autoComplete='off' required                                        
                                />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            {/* Affichage de bouton s'il passe au "true" */}
                            { <button disabled={btn ? false : true} > Connexion </button>}

                        </form>

                        {/* Lien vers la page d'inscription si pas de compte */}                        
                        <div className="linkContainer">
                            <Link className='simpleLink' to="/signup">Nouveau sur Marvel-quiz ? Inscrivez-vous !</Link>
                            <br />
                            <Link className='simpleLink' to="/forgetpassword">Mot de passe oublié ? Récupérez-le ici !</Link>
                        </div>

                    </div>
                </div>
            </div>           
        </div>
    );
};

export default Login;