import { useState } from 'react';
import styles from './Dashboard.module.css'
import { Poppins } from 'next/font/google';
import Password from './Password';

const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

function Dashboard({ username }){
    const [savedPasswords, setSavedPasswords] = useState(0);
    const [filters, setFilters] = useState(['white', 'white', 'white']);
    const [noPasswordsFoundAlertIsShown, setNoPasswordsFoundAlerstIsShown] = useState(false); 

    const filterHandle = (index) => {
        const newFilters = ['white', 'white', 'white'];
        newFilters[index] = filters[index] === 'white' ? 'var(--accent-color)' : 'white';
        setFilters(newFilters);
    }
    return(
        <div className={styles.dashboard}>
            <div className={styles.dashboardHeader}>
                <div className={styles.key}><img src='key2-svgrepo-com.svg'></img></div>
                <h2>Hi {username},<br></br>This is your password manager</h2>
                <div className={styles.container}>
                    <div className={styles.buttons}>
                        <div className={`${styles.savedPasswords} ${poppins.className}`}><p>{savedPasswords}<br></br>saved passwords</p></div>
                        <div className={styles.dropdown}>
                        <div className={`${styles.filters} ${poppins.className}`}><p>Filters</p><img src='settings-setup-svgrepo-com.svg'></img></div>
                        <div className={styles.dropdownContent}>
                            <div style={{backgroundColor: filters[0], color: filters[0]==='white' ? 'var(--secondary-color)' : 'white'}} onClick={() => filterHandle(0)} className={styles.filter}>Sort by Date</div>
                            <div style={{backgroundColor: filters[1], color: filters[1]==='white' ? 'var(--secondary-color)' : 'white'}} onClick={() => filterHandle(1)} className={styles.filter}>Sort by Security Rank</div>
                            <div style={{backgroundColor: filters[2], color: filters[2]==='white' ? 'var(--secondary-color)' : 'white'}} onClick={() => filterHandle(2)} className={styles.filter}>Sort Alphabetically</div>
                        </div>
                        </div>
                    </div>
                    <button className={poppins.className}>Add password</button>
                </div>
            </div>
            <div className={styles.passwords}>
            <div className={styles.searchEngine}>
                    <img alt="search" src="search-svgrepo-com.svg"/>
                    <input className={poppins.className} placeholder="Search..."/>
            </div>
            {noPasswordsFoundAlertIsShown && <p className={styles.noPasswordsFoundAlert}>No passwords found</p>}
            <Password passwordId={1}/>
            </div>
        </div>
    );
}
export default Dashboard