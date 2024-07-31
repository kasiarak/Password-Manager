import styles from "./page.module.css";
import LoginForm from "./components/LoginForm";
import RegistrationForm from './components/RegistrationForm';

export default function Home() {
  return (
    <main className={styles.main}>
     <h1>Password Manager</h1>
     <RegistrationForm/>
    </main>
  );
}
