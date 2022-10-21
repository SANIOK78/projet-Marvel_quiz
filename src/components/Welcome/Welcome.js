import React, {useState, useEffect} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
// import de "user" pour puvoir créer une "referance" 
import {auth, user} from '../Firebase/fiebaseConfig';
//import méthode "fireBase" pour chercher des documents
import { getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import Logout from '../Logout/Logout';
import Quiz from '../Quiz/Quiz';
import Loader from '../Loader/Loader';

const Welcome = () => {

    const navigate = useNavigate();    
    const [userSession, setUserSession ] = useState(null)
    // state pour enregistrer les "doc.data()"
    const [userData, setUserData] = useState({})

    useEffect(() => {      
        let listener = onAuthStateChanged(auth, (user) => {          
            user ? setUserSession(user) : navigate('/')
        }) 

      // Si on a un "user", on va aller le recuperer dans BD:
        if(userSession !== null) {
            //  On invoque "user(id)": user a été authentifié via sa "session"
            // C'est ça qui va nous permettre d'obtenir une referance de la collection
            const refCollection = user(userSession.uid)
          //On doit passer "une reference" de ce "user" a cette méthode 
            getDoc(refCollection)
            .then((snapshot) => {           //si on touve le doc via la referance
                if (snapshot.exists()) {    
                    // on va alimenter la variable d'état local prevue pour ça
                    const docData = snapshot.data();
                    setUserData(docData)            
                }
            })
            .catch(err => console.log(err))      
        }

        return listener();  

    }, [userSession]);  //et on relance si "userSession" change

    return userSession === null ? (
        
        <Loader 
            loadingMsg={"Authentification..."}
            styling={{textAlign:'center', color:'#FFFFFF'}}                   
        /> 
        
    ) : (     //si c'est pas null :
        <div className='quiz-bg'>
            <div className='container'>
                <Logout />
              {/* Une fois qu'on a obtenu un user, on aura un objet, 
              qu'on va passer via un props et le récupérer dans "Quiz" */}
                <Quiz user={userData} />
            </div>
        </div>
    )
};

export default Welcome;