import { Alert } from 'react-bootstrap';
import Utils from 'my-utils';
import styles from './css/MessageBox.module.css';
const { React: { classListBuilder } } = Utils;
const classes = classListBuilder(styles);

const MessageBox = ({ type, message, className }) => (
  <div className={classes('container')}>
    <Alert variant={type} className={classes('alert')}>{message}</Alert>
  </div>
);

export default MessageBox;
