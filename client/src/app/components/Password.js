import { useEffect, useState } from 'react';
import styles from './Password.module.css';
import { Poppins } from 'next/font/google';
const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

function Password({ passwordId }){
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

    useEffect(() => setChangedWebsite(website), [website]);
    const handleChangedWebsite = (e) => {setChangedWebsite(e.target.value)}
    useEffect(() => setChangedEmail(email), [email]);
    const handleChangedEmail = (e) => {setChangedEmail(e.target.value)}
    useEffect(() => setChangedPassword(password), [password]);
    const handleChangedPassword = (e) => {setChangedPassword(e.target.value)}

    useEffect(() => refreshView,[]);

    async function refreshView(){
        try{
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/password/' + passwordId);
            const data = await response.json();
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

      const deletePassword = () => {

      }

      const updatePassword = () => {

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

    function getEditButtonClassName(){
        if(website !== changedWebsite || email !== changedEmail || password !== changedPassword){
            return styles.editBtn
        }else{
            return styles.disabledEditBtn
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
            <div className={styles.inputContainer}><input id="website" value={changedWebsite} onChange={handleChangedWebsite} placeholder='Website'></input></div>
            <div className={styles.inputContainer}><input id="email" value={changedEmail} onChange={handleChangedEmail} placeholder='Email'></input></div>
            <div className={styles.inputContainer}><input id="password" value={changedPassword} onChange={handleChangedPassword} placeholder='Password'></input></div>
            <button className={`${getEditButtonClassName()} ${poppins.className}`} onClick={updatePassword}>Update</button>
                </div>
            </div>}
            <div className={styles.buttons}>
            <button onClick={showDeleteModal}><img alt="delete" src="trash-full-svgrepo-com.svg"></img></button>
            <button onClick={showEditModal}><img alt="edit" src="pencil-ui-svgrepo-com.svg"></img></button>
            <button onClick={showPassword}><img alt="show password" src={passwordIsShown ? "eye-off-svgrepo-com.svg" : "eye-svgrepo-com.svg"}></img></button>
            </div>
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