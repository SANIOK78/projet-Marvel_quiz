import { Link } from 'react-router-dom';
import React, {useRef, useEffect, useState} from 'react';

const Home = () => {

    const [btn, setBtn] = useState(false);

    const refWolverine = useRef(null);
    
    useEffect(() => {
        // Class pour que le personnage affiches les grifs
        refWolverine.current.classList.add("startingImg");
        // Retret des grifs au bout des 3sec
        setTimeout(() => {
            refWolverine.current.classList.remove("startingImg");
         
            setBtn(true);
        }, 1000);

    }, []);

    // Fonction "setLeftImg" qui va permettre l'apparitions des grifs au survol
    // que de côte gauche
    const setLeftImg = () => {
        refWolverine.current.classList.add("leftImg");
    }

    const setRightImg = () => {
        refWolverine.current.classList.add("rightImg");
    }; 

    // Retret des grifs, de côte gauche si on est sur le côte droit et l'inverse.  
    const clearImg = () => {
    
        if( refWolverine.current.classList.contains("leftImg")){  
            
            refWolverine.current.classList.remove("leftImg");

        } else if(refWolverine.current.classList.contains("rightImg")) {
           
            refWolverine.current.classList.remove("rightImg");
        }
    }

    const affichageBtn = btn && (
        <>
            <div onMouseOver={setLeftImg} onMouseOut={clearImg} className="leftBox">
                {/* Redirection vers "signUp" */}
                <Link className="btn-welcome" to="/signup">Inscription</Link>
            </div>

            <div onMouseOver={setRightImg} onMouseOut={clearImg} className="rightBox">
                {/* Redirection vers "login" */}
                <Link className="btn-welcome" to="/login">Connexion</Link>
            </div>
        </>
    )

    return (

        //Utilisation de "useRef": On selection l'element "main"
        <main ref={refWolverine} className='welcomePage'>
        
            {/* L'affichage des bouton  */}
            {affichageBtn}
        </main>
    );
};

export default Home;