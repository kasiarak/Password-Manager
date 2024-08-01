import { Poppins } from 'next/font/google';
import styles from './LoginForm.module.css';
const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

function LoginForm({ setIsUserRegistered }){
    return(
        <div className={styles.LoginForm}>
            <h2>Login</h2>
            <div className={styles.loginInputs}>
                <img src='person-svgrepo-com.svg'/>
                <input className={poppins.className} placeholder='Username'></input>
            </div>
            <hr></hr>
            <div className={styles.loginInputs}>
                <img src='lock-svgrepo-com.svg'/>
                <input type="password" className={poppins.className} placeholder='Password'></input>
            </div>
            <hr></hr>
            <div className={styles.buttons}>
                <button className={poppins.className} >Login</button>
                <p className={styles.message}></p>
                <h3>Don't have an account?</h3>
                <button onClick={() => setIsUserRegistered(false)} className={poppins.className} >Sing up</button>
            </div>
        </div>
    );
}
export default LoginForm