import React from 'react';
import logo from './logo.svg';
import Login from  "./component/login"
import './App.css';

import { Routes,Route }  from "react-router-dom"
//const Home = React.lazy(()=> import("./component/Home"))
import Home from "./component/Home"
function App() {
  return (
   
      <div>
        {/* <Login/> */}
        
        <Routes>
          <Route  path ="/" element= {<Login/>}/>
          <Route  path="/home" element= {<Home/>}/>
        </Routes>
      </div>
        
 
   
  );
}

export default App;
