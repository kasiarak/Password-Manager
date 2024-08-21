import { Poppins } from 'next/font/google';
import styles from './LoginForm.module.css';
import { useEffect, useState } from 'react';
const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

function LoginForm({ setIsUserRegistered, setIsUserLoggedIn}){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleUsername = (event) => setUsername(event.target.value);
    const handlePassword = (event) => setPassword(event.target.value);
    const [message, setMessage] = useState('');

    async function login(){
        const body = {
            username: username,
            password: password,
        }
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if(data.message===null){
                localStorage.setItem('username', username);
                localStorage.setItem('isUserLoggedIn', 'true'); 
                setIsUserLoggedIn(true);
            }else{
                setMessage(data.message);
            } 
        }catch(error){
            setMessage('Login failed. Please try again later.');
        }
    } 

    useEffect(() => {
        const loggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
        setIsUserLoggedIn(loggedIn);
      }, []);
    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            login();
        }
    };

    return(
        <div className={styles.LoginForm}>
            <h2>Login</h2>
            <div className={styles.loginInputs}>
                <img alt="username" src='person-svgrepo-com.svg'/>
                <input id="username" autoComplete='username' value={username} onChange={handleUsername} onKeyDown={handleKeyDown} className={poppins.className} placeholder='Username'></input>
            </div>
            <hr></hr>
            <div className={styles.loginInputs}>
                <img alt="password" src='lock-svgrepo-com.svg'/>
                <input id="password" autoComplete='current-password' value={password} onChange={handlePassword} onKeyDown={handleKeyDown} type="password" className={poppins.className} placeholder='Password'></input>
            </div>
            <hr></hr>
            <div className={styles.buttons}>
                <button onClick={login} className={poppins.className} >Login</button>
                <p className={styles.message}>{message}</p>
                <h3>Don&apos;t have an account?</h3>
                <button onClick={() => setIsUserRegistered(false)} className={poppins.className} >Sing up</button>
            </div>
        </div>
    );
}
export default LoginForm