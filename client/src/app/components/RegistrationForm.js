import { Poppins } from 'next/font/google';
import styles from './RegistrationForm.module.css'
const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

function RegistrationForm(){
    return(
        <div className={styles.registrationForm}>
        <h2>Registration</h2>
        <div className={styles.registrationInputs}>
            <img src='person-svgrepo-com.svg'/>
            <input className={poppins.className} placeholder='Username'></input>
        </div>
        <hr></hr>
        <div className={styles.registrationInputs}>
            <img id={styles.emailIcon} src='email-svgrepo-com.svg'/>
            <input type="email" className={poppins.className} placeholder='Email' pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required></input>
        </div>
        <hr></hr>
        <div className={styles.registrationInputs}>
            <img src='lock-svgrepo-com.svg'/>
            <input type="password" className={poppins.className} placeholder='Password'></input>
        </div>
        <hr></hr>
        <div className={styles.registrationInputs}>
            <img src='key-svgrepo-com.svg'/>
            <input type="password" className={poppins.className} placeholder='Confirm Password'></input>
        </div>
        <hr></hr>
        <div className={styles.buttons}>
            <button className={poppins.className}>Create Account</button>
            <p className={styles.message}></p>
            <h3>Already have an account?</h3>
            <button className={poppins.className}>Sing in</button>
        </div>
    </div>
    );
}
export default RegistrationForm