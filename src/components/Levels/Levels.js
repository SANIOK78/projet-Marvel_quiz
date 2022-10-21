import React, {useEffect, useState} from 'react';
import Stepper from 'react-stepper-horizontal'


const Levels = ({ levelNames, quizLevel}) => {

    // State qui va stocker le nouveau tab généré dans "useEffect"
    const[levels, setLevels] = useState([])

    useEffect(() => {
       
        const quizSteps = levelNames.map( niveau => ({
            title: niveau.toUpperCase()  //on met chaque element en MAJ
        }))

        setLevels(quizSteps)

    }, [levelNames])  

    return (
        <div className='levelsContainer' style={{background:"transparent"}}>
 
            {/* affichage dynamique */}
            <Stepper 
                steps={ levels }                   
                activeStep={ quizLevel }
             //la stylisation avec les props depuis le package
                circleTop={0}                   //reduire "marginTop :0"
                activeTitleColor={'#d31017'}   //culeur sur text élementActive
                activeColor={'#d31017'}        //culeur de fond élementActive
                completeTitleColor={'#E0E0E0'} //culeur sur text élement 
                completeColor={'#E0E0E0'}      //culeur de fond élement
                completeBarColor={'#E0E0E0'}   //couleur de la barre 
                barStyle={"dashed"}          //  barre pointillé
                size={45}                    //la taille du rond
                circleFontSize={22}          //le taille du chiffre interieur
            />

        </div>
    );
};

export default React.memo(Levels);