import axios from "axios";
import store from './store/index';

console.log(JSON.parse(localStorage.getItem('vuex')).user.user)

export default axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-type": "application/json",
    'x-access-token': store.state.user.token
    // 'x-access-token': JSON.parse(localStorage.getItem('vuex')).user.token
  }
});
