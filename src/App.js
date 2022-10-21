import React from 'react';
// import "Routes, Route"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import Welcome from './components/Welcome/Welcome'; 
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ErrorPage from './components/ErrorPage/ErrorPage';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import './App.css';
// import de iconContext qui va permettre d'appliquer un style sur tous
// les iconnes qu'on va utiliser dans le projet
import {IconContext} from 'react-icons'


function App() {

 // Mise en place des Routes

  return (
    <Router>

     {/* On applique le package "IconContext" */}
      <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
        <Header /> 

        <Routes >
          <Route path="/" element={ <Home /> } />
          <Route path="/welcome" element={ <Welcome /> } />
          <Route path="/login" element={ <Login />} />
          <Route path="/signup" element={ <Signup /> } />
          <Route path="/forgetpassword" element={ <ForgetPassword /> } />

          <Route path="*" element={ <ErrorPage /> } />

        </Routes>

        <Footer />
      </IconContext.Provider>

    </Router>
  );
}

export default App;
