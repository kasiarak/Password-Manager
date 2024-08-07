import { useState } from 'react';
import styles from './Dashboard.module.css'
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

function Dashboard({ username }){
    const [savedPasswords, setSavedPasswords] = useState(0);

    return(
        <div className={styles.dashboard}>
            <div className={styles.dashboardHeader}>
                <div className={styles.key}><img src='key2-svgrepo-com.svg'></img></div>
                <h2>Hi {username},<br></br>This is your password manager</h2>
                <div className={styles.container}>
                    <div className={styles.buttons}>
                        <div className={`${styles.savedPasswords} ${poppins.className}`}><p>{savedPasswords}<br></br>saved passwords</p></div>
                        <div className={`${styles.filters} ${poppins.className}`}><p>Filters</p><img src='settings-setup-svgrepo-com.svg'></img></div>
                    </div>
                    <button className={poppins.className}>Add password</button>
                </div>
            </div>
        </div>
    );
}
export default Dashboard