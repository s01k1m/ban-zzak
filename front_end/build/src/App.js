import React, { useEffect, useState } from 'react';
import './App.css';
import Form from './components/form.js';
import earth from './assets/earth.png';


export default function App() {
  useEffect(() => {
    const siteWidth = window.innerWidth;
    const siteHeight = window.innerHeight;

    for (let i = 0; i <= 100; i++) {
      const top = Math.floor(Math.random() * siteHeight);
      const left = Math.floor(Math.random() * siteWidth);

      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = `${top}px`;
      star.style.left = `${left}px`;

      document.querySelector('.stars').appendChild(star);
    }
  }, []);

  const [showForm, setShowForm] = useState(false);

  const hideMain = () => {
    setShowForm(true);
  };

  return (
    <div className="App">
      <div className="wrapper">
        <img src={earth} id="earth" onClick={hideMain} alt="Earth" />
        <span className={`content ${showForm ? 'not-show' : 'show'}`}>
          Let's<br/>Find<br/>your<br/>friend's<br/>home
        </span>

      </div>
      <div className="stars"></div>
        <div className={`componentForm ${showForm ? 'show' : 'not-show'}`}>
          <Form />
        </div>
      {/* <div className="about">

      </div> */}
    </div>
  );
}
