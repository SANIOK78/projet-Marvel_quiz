import React, {useState, useEffect} from 'react';
// Deconnexion de Firebase 
import {signOut} from 'firebase/auth';
//import function de authentification a firebase
import  { auth } from '../Firebase/fiebaseConfig';
import { useNavigate } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

const Logout = () => {

    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if(checked === true) {

            signOut(auth)
            .then(() => {
                console.log("Vous êtez déconnecté ");

                // faire pacienter user 1sec avant la
                // deconnexion et redirection vers Accueil
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            })
            .catch((error) => {
                console.log("Oups, erreur ")
            })
        }
    }, [checked])   
 
    // Function
    const handleChange = event => {

        setChecked(event.target.checked);
    }
    
    return (
        <div className='logoutContainer'>
            <label  className="switch">
                
                <input 
                    onChange={handleChange}
                    type="checkbox" 
                    checked={checked}   //valeur initiale false                     
                />

                {/* "data-tip" => Message qu'on va afficher */}
                <span className='slider round' data-tip="Déconnexion !!!"></span>
                
            </label>

            {/* Utilisation de "ReactTooltip" avec les paramétre obligatoir */}
            <ReactTooltip 
                place="left"     //placé côté gauche de l'élément
                type="dark"     //couleur de fond noir
                effect="solid"   //qu'il ne bouge/floate pas
            />         
        </div>
    );
};

export default Logout;