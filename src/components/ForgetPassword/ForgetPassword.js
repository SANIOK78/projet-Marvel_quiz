import React, {useState} from 'react';
// methode "firebase" permettant de reinitialiser le mot de passe perdu
import { sendPasswordResetEmail } from 'firebase/auth';
// methode "firebase" d'authentification
import { auth } from '../Firebase/fiebaseConfig';
import { Link, useNavigate} from 'react-router-dom';

const ForgetPassword = (props) => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
      
        sendPasswordResetEmail(auth, email)
        .then(() => {
            setError(null);
            setSuccess(`Consultez votre mail ${email} pour changer le mot de passe`);
            setEmail("");
            setTimeout(() => {
                navigate("/login")
            }, 5000);
        })
        .catch(() => {
            setError(error);
            setEmail("");
        })
    }

    const disabled = email === "";

    return (
        <div className='signUpLoginBox'>

            <div className="slContainer">
                
                <div className="formBoxLeftForget">  </div> 

                {/* Partie droite avec le form @mail */}
                <div className="formBoxRight">
                    <div className="formContent">

                        {/* Géstion de message success */}
                        { success && <span style={{ 
                            color: "white",
                            background: "green",
                            border: "1px solid green"
                        }}>{success}</span> }

                        {/* Géstion message Erreur */}
                        {error && <span>{error.message}</span>}

                        <h2>Mot de passe oublié ?</h2>

                        {/* Submit de formulaire */}
                        <form action=""  onSubmit={handleSubmit}>

                            <div className="inputBox">
                                <input onChange={(e) => setEmail(e.target.value)} value={email}
                                    type="email" id='email' autoComplete='off' required                                    
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            {/* le bouton (desactivé ) qui va s'activer si on renseigne @mail */}
                            <button disabled={disabled}>Récupérer</button>

                        </form>

                        {/* Lien vers la page de conexion  */}                      
                        <div className="linkContainer">
                            <Link className='simpleLink' to="/login">Déjà inscit ? Connectez-vous !</Link>
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    );
};

export default ForgetPassword;