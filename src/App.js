import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from './Game/Container';

function App () {
  return (
    <div className={styles.App}>
      <Container />
    </div>
  );
}

export default App;
