'use client'
import styles from "./page.module.css";
import LoginForm from "./components/LoginForm";
import RegistrationForm from './components/RegistrationForm';
import Dashboard from "./components/Dashboard";
import { useState } from "react";
import { Poppins } from 'next/font/google';
const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

export default function Home() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); 

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

  return (
    <main className={styles.main}>
     <h1>Password Manager</h1>
     {isUserLoggedIn && isUserRegistered && <h2 onClick={showModal} className={styles.logOutBtn}>Log out</h2>}
     {isModalVisible && <div className={styles.modalBackground}>
     <div className={styles.modal}>
      <button className={styles.hideModalBtn} onClick={hideModal}>&#10799;</button>
      <h3>Are you sure you want to log out?</h3>
      <button className={`${styles.showModalBtn} ${poppins.className}`} onClick={logOut}>Log out</button>
     </div></div>}
     {!isUserLoggedIn && isUserRegistered && <LoginForm  setIsUserRegistered={setIsUserRegistered} setIsUserLoggedIn={setIsUserLoggedIn}/>}
     {!isUserLoggedIn && !isUserRegistered && <RegistrationForm setIsUserRegistered={setIsUserRegistered} setIsUserLoggedIn={setIsUserLoggedIn}/>}
     {isUserLoggedIn && isUserRegistered && <Dashboard username={localStorage.getItem('username')}/>}
    </main>
  );
} 
