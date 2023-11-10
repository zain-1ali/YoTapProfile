import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  getDatabase,
  set,
  ref,
  update,
  push,
  onValue,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDNuqgyngbzgUTvAg2DC9w0MgsN3i2Y5JA",
  authDomain: "yotap-test.firebaseapp.com",
  databaseURL: "https://yotap-test-default-rtdb.firebaseio.com",
  projectId: "yotap-test",
  storageBucket: "yotap-test.appspot.com",
  messagingSenderId: "718658803324",
  appId: "1:718658803324:web:a97f1d720ab73c92bd9bf9",
  measurementId: "G-GETPH5PQ2Q",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
// export const db=getFirestore(app)
export const auth = getAuth(app);
export const storage = getStorage(app);
