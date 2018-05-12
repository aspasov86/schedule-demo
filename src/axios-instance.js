import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://schedule-demo-e5c32.firebaseio.com/'
});

export default instance;
