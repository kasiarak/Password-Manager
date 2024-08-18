'use client'
import styles from "./page.module.css";
import LoginForm from "./components/LoginForm";
import RegistrationForm from './components/RegistrationForm';
import Dashboard from "./components/Dashboard";
import { useEffect, useState } from "react";
import { Poppins } from 'next/font/google';
const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

export default function Home() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  
  const [mode, setMode] = useState('light');

  function showModal(){
    setIsModalVisible(true); 
  }

  function hideModal(){
    setIsModalVisible(false);
  }
  
  function logOut(){
    setIsUserLoggedIn(false); 
    localStorage.setItem('isUserLoggedIn', 'false');
    localStorage.setItem('username', null);
    hideModal();  
  }

  useEffect(() => checklogin(),[]);

  function checklogin(){
    if(localStorage.getItem('isUserLoggedIn')==='true') {
      setIsUserLoggedIn(true);
      setIsLoading(false);
    }else setIsLoading(false); 
  }

  useEffect(() => {
    switchMode();
  },[])

  function switchMode(){
    if(localStorage.getItem('mode') === 'light') {
      setMode('dark');
      localStorage.setItem('mode', 'dark');
      document.documentElement.style.setProperty('--main-color', '#292828');
      document.documentElement.style.setProperty('--secondary-color', '#ffffff');
      document.documentElement.style.setProperty('--scrollbar-color', '#606060 #2b2b2b');
      document.documentElement.style.setProperty('--img-filter', 'invert(1) brightness(2)');
    }
    else{
      setMode('light');
      localStorage.setItem('mode', 'light');
      document.documentElement.style.setProperty('--main-color', '#ffffff');
      document.documentElement.style.setProperty('--secondary-color', '#000000');
      document.documentElement.style.setProperty('--scrollbar-color', '#c0c0c0 #f0f0f0');
      document.documentElement.style.setProperty('--img-filter', 'none');
    }  
  }

  function getSwitchBtnClass(){
    if(mode === 'light') return styles.lightModeSwitch
    else return styles.darkModeSwitch
  }

  return (
    <main className={styles.main}>
     <h1>Password Manager</h1>
     {isLoading && <div className={styles.loadingPage}><h2>Loading...</h2></div>}
     {!isLoading &&
     <div>
          {isUserLoggedIn && isUserRegistered && <h2 onClick={showModal} className={styles.logOutBtn}>Log out</h2>}
          <div onClick={switchMode} className={styles.switchModeBtn}><div className={getSwitchBtnClass()}></div></div>
          {isModalVisible && <div className={styles.modalBackground}>
          <div className={styles.modal}>
           <button className={styles.hideModalBtn} onClick={hideModal}>&#10799;</button>
           <h3>Are you sure you want to log out?</h3>
           <button className={`${styles.showModalBtn} ${poppins.className}`} onClick={logOut}>Log out</button>
          </div></div>}
          {!isUserLoggedIn && isUserRegistered && <LoginForm  setIsUserRegistered={setIsUserRegistered} setIsUserLoggedIn={setIsUserLoggedIn}/>}
          {!isUserLoggedIn && !isUserRegistered && <RegistrationForm setIsUserRegistered={setIsUserRegistered} setIsUserLoggedIn={setIsUserLoggedIn}/>}
          {isUserLoggedIn && isUserRegistered && <Dashboard username={localStorage.getItem('username')}/>}
     </div>
     }
    </main>
  );
} 
