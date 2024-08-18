import { useEffect, useState } from 'react';
import styles from './Password.module.css';
import { Poppins } from 'next/font/google';
const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

function Password({ passwordId, refreshDashboard }){
    const [passwordIsShown, setPasswordIsShown] = useState(false);
    const [website, setWebsite] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [lastUpdate, setLastUpdate] = useState('');
    const [securityRank, setSecurityRank] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
    const [changedWebsite, setChangedWebsite] = useState(website); 
    const [changedEmail, setChangedEmail] = useState(email); 
    const [changedPassword, setChangedPassword] = useState(password);
    const [websiteAlertIsShowing, setWebsiteAlertIsShowing] = useState(false);
    const [emailAlertIsShowing, setEmailAlertIsShowing] = useState(false);
    const [passwordAlertIsShowing, setPasswordAlertIsShowing] = useState(false); 

    useEffect(() => setChangedWebsite(website), [website]);
    const handleChangedWebsite = (e) => {
        setChangedWebsite(e.target.value);
        if(e.target.value.length > 16) setWebsiteAlertIsShowing(true);
        else setWebsiteAlertIsShowing(false);
    }
    useEffect(() => setChangedEmail(email), [email]);
    const handleChangedEmail = (e) => {
        setChangedEmail(e.target.value);
        if(e.target.value.length > 34) setEmailAlertIsShowing(true);
        else setEmailAlertIsShowing(false)
    }
    useEffect(() => setChangedPassword(password), [password]);
    const handleChangedPassword = (e) => {
        setChangedPassword(e.target.value);
        if(e.target.value.length > 22) setPasswordAlertIsShowing(true);
        else setPasswordAlertIsShowing(false);
    }

    useEffect(() => refreshView,[]);

    async function refreshView(){
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/password/' + passwordId);
            const data = await response.json();

            if (data.length === 0) {
                setWebsite('');
                setEmail('');
                setPassword('');
                setLastUpdate('');
                setSecurityRank('');
                return;
            }

            setWebsite(data[0].website);
            setEmail(data[0].email);
            setPassword(data[0].password);
            const date = new Date(data[0].last_update);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const year = date.getFullYear();
            setLastUpdate(`${day}-${month}-${year}`);
            switch(data[0].security_rank){
                case 0:
                    setSecurityRank('Insecure');
                    break;
                case 1:
                    setSecurityRank('Insecure');
                    break;
                case 2:
                    setSecurityRank('Needs Improvement');
                    break;
                case 3:
                    setSecurityRank('Secure');
                    break;
                case 4:
                    setSecurityRank('Very Secure');
                    break;                
            }
        }catch(error){
            console.error(error);
        }
    }

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

    const deletePassword = async () => {
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/delete/' + passwordId, {
                method: 'DELETE'
            });
            if (response.ok) {
                await refreshDashboard(); 
            }
            hideDeleteModal(); 
        }catch(error){
            console.error(error);
        }
      }

    const updatePassword = async () => {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0'); 
        const day = String(new Date().getDate()).padStart(2, '0');
        const newLastUpdate = `${year}-${month}-${day}`;
        const body = {};
        if (changedWebsite !== website) {
            body.website = changedWebsite;
        }
        if (changedPassword !== password) {
            body.password = changedPassword;
        }
        if (changedEmail !== email) {
            body.email = changedEmail;
        }
        if(lastUpdate !== newLastUpdate){
            body.last_update = newLastUpdate;
        }
        if(changedPassword !== password){
            let securityPoints = 0;
            if(changedPassword.length >= 8) securityPoints++;
            if(/[a-z]/.test(changedPassword) && /[A-Z]/.test(changedPassword)) securityPoints++;
            if(/\d/.test(changedPassword)) securityPoints++;
            if(/[!@#$%^&*(),.?":{}|<>]/.test(changedPassword)) securityPoints++;
            body.security_rank = securityPoints; 
        } 
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/updatePassword/' + passwordId, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (response.ok) { 
                await refreshView(); 
                hideEditModal();
            }
      }catch(error){
        console.error(error);
      }
    }

    function showDeleteModal(){setIsDeleteModalVisible(true)}
    function hideDeleteModal(){setIsDeleteModalVisible(false)}
    function showEditModal(){setIsEditModalVisible(true)}
    function hideEditModal(){
        setIsEditModalVisible(false);
        setChangedWebsite(website);
        setChangedEmail(email);
        setChangedPassword(password);
    }

    function getEditButtonClassName() {
        const isAnyAlertShowing = websiteAlertIsShowing || emailAlertIsShowing || passwordAlertIsShowing;
        const isNothingChanged = website === changedWebsite && email === changedEmail && password === changedPassword;
    
        if (isAnyAlertShowing || isNothingChanged) {
            return styles.disabledEditBtn;
        } else {
            return styles.editBtn;
        }
    }

    return(
        <div className={styles.password}>
            {isDeleteModalVisible && <div className={styles.modalBackground}>
                <div className={styles.deleteModal}>
                    <button className={styles.hideModalBtn} onClick={hideDeleteModal}>&#10799;</button>
                    <h3>Are you sure you want to delete this password?</h3>
                    <button className={`${styles.deleteBtn} ${poppins.className}`} onClick={deletePassword}>Delete</button>
                </div>
            </div>}
            {isEditModalVisible && <div className={styles.modalBackground}>
                <div className={styles.editModal}>
                    <button className={styles.hideModalBtn} onClick={hideEditModal}>&#10799;</button>
                    <h3>Make changes</h3>
                    {websiteAlertIsShowing && <p className={styles.websiteAlert}>Maximum of 16 characters.</p>}
                    <div className={styles.inputContainer}><input id="website" autoComplete='website' value={changedWebsite} onChange={handleChangedWebsite} placeholder='Website'></input></div>
                    {emailAlertIsShowing && <p className={styles.emailAlert}>Maximum of 34 characters.</p>}
                    <div className={styles.inputContainer}><input id="email" autoComplete='email' value={changedEmail} onChange={handleChangedEmail} placeholder='Email'></input></div>
                    {passwordAlertIsShowing && <p className={styles.passwordAlert}>Maximum of 22 characters.</p>}
                    <div className={styles.inputContainer}><input id="password" autoComplete='current-password' value={changedPassword} onChange={handleChangedPassword} placeholder='Password'></input></div>
                    <button className={`${getEditButtonClassName()} ${poppins.className}`} onClick={updatePassword}>Update</button>
                </div>
            </div>}
            <div className={styles.buttons}>
            <button onClick={showDeleteModal}><img alt="delete" src="trash-full-svgrepo-com.svg"></img></button>
            <button onClick={showEditModal}><img alt="edit" src="pencil-ui-svgrepo-com.svg"></img></button>
            <button onClick={showPassword}><img alt="show password" src={passwordIsShown ? "eye-off-svgrepo-com.svg" : "eye-svgrepo-com.svg"}></img></button>
            </div>
            <div className={styles.passwordInfoContainer}>
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
        </div>
    );
}
export default Password