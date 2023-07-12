import React, { useEffect, useState } from 'react';
import './App.css';
import Form from './components/form.js';
import earth from './assets/earth.png';
import arrow from './assets/arrow.png';

export default function App() {
  useEffect(() => {
    const siteWidth = window.innerWidth;
    const siteHeight = window.innerHeight;

    for (let i = 0; i <= 100; i++) {
      const top = Math.floor(Math.random() * siteHeight * 0.8);
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

      <img src={earth} id="earth" onClick={hideMain} alt="Earth" />
      <p className={`content ${showForm ? 'not-show' : 'show'}`}>
        Find<br/>your <br/> friend's <br/>home
        {/* <img src={arrow} className="arrow" alt="Arrow" /> */}
      </p>
      <div className="stars"></div>
      <div className={`comspanonentForm ${showForm ? 'show' : 'not-show'}`}>
        <Form />
      </div>
    </div>
  );
}
