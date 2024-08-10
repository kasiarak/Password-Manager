import { useEffect, useState } from 'react';
import styles from './Password.module.css';

function Password(){
    const [passwordIsShown, setPasswordIsShown] = useState(false);
    const [website, setWebsite] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [lastUpdate, setLastUpdate] = useState('');
    const [securityRank, setSecurityRank] = useState('');

    function showPassword(){
        setPasswordIsShown(prevState => !prevState);
    }

    const getRankClassName = () => {
        switch (securityRank) {
          case 'Very Secure':
            return styles.verySecure;
          case 'Secure':
            return styles.secure;
          case 'Needs Improvement':
            return styles.needsImprovement;
          case 'Insecure':
            return styles.insecure;
          default:
            return '';
        }
      };

    return(
        <div className={styles.password}>
            <button><img src="trash-full-svgrepo-com.svg"></img></button>
            <button><img src="pencil-ui-svgrepo-com.svg"></img></button>
            <button onClick={showPassword}><img src={passwordIsShown ? "eye-off-svgrepo-com.svg" : "eye-svgrepo-com.svg"}></img></button>
            <div className={styles.passwordInfo}>
                <h3>Website: {website}</h3>
                <h3>Password: {passwordIsShown ? password : "••••••••••••••"}</h3>
                <h3>Email: {email}</h3>
            </div>
            <div className={styles.securityRank}>
                <h3>Security rank:</h3>
                <div className={styles.rankingBar}><div className={getRankClassName()}></div></div>
                {securityRank}
            </div>
            <h3 className={styles.lastUpdate}>Last<br></br>update<br></br>{lastUpdate}</h3>
        </div>
    );
}
export default Password