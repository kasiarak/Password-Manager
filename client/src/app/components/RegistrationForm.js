import { Poppins } from 'next/font/google';
import styles from './RegistrationForm.module.css'
import { useState } from 'react';
const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

function RegistrationForm({ setIsUserRegistered }){
    const [username, setUsername] = useState(""); 
    const handleUsername = (event) => setUsername(event.target.value);
    const [email, setEmail] = useState(""); 
    const handleEmail = (event) => setEmail(event.target.value);
    const [password, setPassword] = useState(""); 
    const handlePassword = (event) => setPassword(event.target.value);
    const [confirmedPassword, setConfirmedPassword] = useState(""); 
    const handleConfirmedPassword = (event) => setConfirmedPassword(event.target.value);

    const [message, setMessage] = useState();

    async function registration(){
        const body = {
           username: username,
           email: email,
           password: password,
           confirmedPassword: confirmedPassword
        }
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/registration', {
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
            setMessage(data.message);
        } catch (error) {
            setMessage('Registration failed. Please try again later.');
        }
    }
    
    return(
        <div className={styles.registrationForm}>
        <h2>Registration</h2>
        <div className={styles.registrationInputs}>
            <img src='person-svgrepo-com.svg'/>
            <input value={username} onChange={handleUsername} className={poppins.className} placeholder='Username'></input>
        </div>
        <hr></hr>
        <div className={styles.registrationInputs}>
            <img id={styles.emailIcon} src='email-svgrepo-com.svg'/>
            <input value={email} onChange={handleEmail} type="email" className={poppins.className} placeholder='Email'></input>
        </div>
        <hr></hr>
        <div className={styles.registrationInputs}>
            <img src='lock-svgrepo-com.svg'/>
            <input value={password} onChange={handlePassword} type="password" className={poppins.className} placeholder='Password'></input>
        </div>
        <hr></hr>
        <div className={styles.registrationInputs}>
            <img src='key-svgrepo-com.svg'/>
            <input value={confirmedPassword} onChange={handleConfirmedPassword} type="password" className={poppins.className} placeholder='Confirm Password'></input>
        </div>
        <hr></hr>
        <div className={styles.buttons}>
            <button onClick={registration} className={poppins.className}>Create Account</button>
            <p className={styles.message}>{message}</p>
            <h3>Already have an account?</h3>
            <button  onClick={() => setIsUserRegistered(true)} className={poppins.className}>Sing in</button>
        </div>
    </div>
    );
}
export default RegistrationForm