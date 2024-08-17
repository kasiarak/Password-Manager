import { useEffect, useRef, useState } from 'react';
import styles from './Dashboard.module.css'
import { Poppins } from 'next/font/google';
import Password from './Password';

const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

function Dashboard({ username }){
    const [savedPasswords, setSavedPasswords] = useState(0);
    const [filters, setFilters] = useState(['white', 'white', 'white']);
    const [noPasswordsFoundAlertIsShown, setNoPasswordsFoundAlerstIsShown] = useState(false); 
    const [userId, setUserId] = useState(0);
    const [passwords, setPasswords] = useState([]); 
    const [isAddPasswordModalVisible, setIsAddPasswordModalVisible] = useState(false);
    const [newWebsite, setNewWebsite] = useState('');
    const [newEmail, setNewEmail] = useState(''); 
    const [newPassword, setNewPassword] = useState(''); 
    const [websiteAlertIsShowing, setWebsiteAlertIsShowing] = useState(false);
    const [emailAlertIsShowing, setEmailAlertIsShowing] = useState(false);
    const [passwordAlertIsShowing, setPasswordAlertIsShowing] = useState(false);

    const handleNewWebsite = (e) => {
        setNewWebsite(e.target.value);
        if(e.target.value.length > 16) setWebsiteAlertIsShowing(true);
        else setWebsiteAlertIsShowing(false);
    }
    const handleNewEmail = (e) => {
        setNewEmail(e.target.value);
        if(e.target.value.length > 22) setEmailAlertIsShowing(true);
        else setEmailAlertIsShowing(false)
    }
    const handleNewPassword = (e) => {
        setNewPassword(e.target.value);
        if(e.target.value.length > 22) setPasswordAlertIsShowing(true);
        else setPasswordAlertIsShowing(false);
    }

    const filterHandle = (index) => {
        const newFilters = ['white', 'white', 'white'];
        newFilters[index] = filters[index] === 'white' ? 'var(--accent-color)' : 'white';
        setFilters(newFilters);
    }

    useEffect(() => {
        getUserId();
    }, []);
    
    useEffect(() => {
        if (userId !== 0) {
            refreshDashboard();
        }
    }, [userId]);

    async function getUserId(){
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/id/' + username);
            const data = await response.json(); 
            setUserId(data.id);
        }catch(error){
            console.error(error)
        }
    }

    async function refreshDashboard(){
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/passwords/' + userId);
            const data = await response.json();
            setSavedPasswords(data.length); 
            if(data.length === 0){
                setNoPasswordsFoundAlerstIsShown(true);
                let newPasswords = [];
                setPasswords(newPasswords); 
            }else{
                setNoPasswordsFoundAlerstIsShown(false);
                let newPasswords = [];
                for(let i = 0; i < data.length; i++){
                    newPasswords.push(<Password refreshDashboard={refreshDashboard} key={data[i].id} passwordId={data[i].id}></Password>)
                }
                setPasswords(newPasswords); 
            }
        }catch(error){
            console.error(error);
        }
    }

    async function addPassword(){
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0'); 
        const day = String(new Date().getDate()).padStart(2, '0');
        const newLastUpdate = `${year}-${month}-${day}`;

        let securityPoints = 0;
            if(newPassword.length >= 8) securityPoints++;
            if(/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) securityPoints++;
            if(/\d/.test(newPassword)) securityPoints++;
            if(/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) securityPoints++;

        const body = {
            website: newWebsite,
            email: newEmail,
            password: newPassword,
            last_update: newLastUpdate,
            security_rank: securityPoints,
            user_id: userId  
        }
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/addPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            console.log(response)
            if(response.ok){
                refreshDashboard();
                hideAddPasswordModal();
            }
        }catch(error){
            console.error(error);
        }
    }

    function getAddPasswordButtonClassName(){
        if(newWebsite === '' || newEmail === '' || newPassword === '' || emailAlertIsShowing || websiteAlertIsShowing || passwordAlertIsShowing){
            return styles.disabledAddPaswordBtn
        }else{
            return styles.addPasswordBtn
        }
    }

    function showAddPasswordModal(){
        setIsAddPasswordModalVisible(true);
    }

    function hideAddPasswordModal(){
        setIsAddPasswordModalVisible(false);
        setNewWebsite('');
        setNewEmail('');
        setNewPassword('')
    }

    async function search(e){
        if(e.target.value===''){
            refreshDashboard();
        }else{
            try{
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/search/' + userId + '/' + e.target.value);
                const data = await response.json();
                if(data.length === 0){
                    setNoPasswordsFoundAlerstIsShown(true);
                    let newPasswords = [];
                    setPasswords(newPasswords); 
                }else{
                    setNoPasswordsFoundAlerstIsShown(false);
                    let newPasswords = [];
                    for(let i = 0; i < data.length; i++){
                        newPasswords.push(<Password refreshDashboard={refreshDashboard} key={data[i].id} passwordId={data[i].id}></Password>)
                    }
                    setPasswords(newPasswords); 
                }
            }catch(error){
                console.error(error);
            }
        }
    }

    return(
        <div className={styles.dashboard}>
            {isAddPasswordModalVisible && <div className={styles.modalBackground}>
                <div className={styles.addPasswordModal}>
                    <button className={styles.hideModalBtn} onClick={hideAddPasswordModal}>&#10799;</button>
            {websiteAlertIsShowing && <p className={styles.websiteAlert}>Maximum of 16 characters.</p>}
            <div className={styles.inputContainer}><input id="website" value={newWebsite} onChange={handleNewWebsite} placeholder='Website'></input></div>
            {emailAlertIsShowing && <p className={styles.emailAlert}>Maximum of 22 characters.</p>}
            <div className={styles.inputContainer}><input id="email" value={newEmail} onChange={handleNewEmail} placeholder='Email'></input></div>
            {passwordAlertIsShowing && <p className={styles.passwordAlert}>Maximum of 22 characters.</p>}
            <div className={styles.inputContainer}><input id="password" value={newPassword} onChange={handleNewPassword} placeholder='Password'></input></div>
            <button className={`${getAddPasswordButtonClassName()} ${poppins.className}`} onClick={addPassword}>Create a new password</button>
                </div>
            </div>}
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
                    <button className={poppins.className} onClick={showAddPasswordModal}>Add password</button>
                </div>
            </div>
            <div className={styles.passwords}>
            <div className={styles.searchEngine}>
                    <img alt="search" src="search-svgrepo-com.svg"/>
                    <input onChange={search} id="search_engine" className={poppins.className} placeholder="Search..."/>
            </div>
            {noPasswordsFoundAlertIsShown && <p className={styles.noPasswordsFoundAlert}>No passwords found</p>}
            {passwords}
            </div>
        </div>
    );
}
export default Dashboard