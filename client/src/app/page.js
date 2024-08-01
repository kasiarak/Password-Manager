'use client'
import styles from "./page.module.css";
import LoginForm from "./components/LoginForm";
import RegistrationForm from './components/RegistrationForm';
import { useState } from "react";

export default function Home() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(true);

  return (
    <main className={styles.main}>
     <h1>Password Manager</h1>
     {!isUserLoggedIn && isUserRegistered && <LoginForm  setIsUserRegistered={setIsUserRegistered}/>}
     {!isUserLoggedIn && !isUserRegistered && <RegistrationForm setIsUserRegistered={setIsUserRegistered}/>}
    </main>
  );
} 
