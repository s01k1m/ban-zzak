import React from "react";
import axios from 'axios';
import './App.css'
import Form from './components/form.js'
import earth from './assets/earth.png'

export default function App() {
  
  return (
    <div className='App'>
      <h1 className='click-head'>Find your friend's home</h1>
      <div className="things">
        <div className="content">
          <div className="arrow">
            <div className="curve"></div>
            <div className="point"></div>
          </div>
        </div> 
      </div>
      <img src={earth} className='earth' ></img>
      <div className='componentForm'>
        <Form />
      </div>
    </div>
  );
}
