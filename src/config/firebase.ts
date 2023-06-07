// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyCWauY3Esz1JXCjZIlb7qYqRAsD9Dpcc1c',
	authDomain: 'fir-example-7b651.firebaseapp.com',
	projectId: 'fir-example-7b651',
	storageBucket: 'fir-example-7b651.appspot.com',
	messagingSenderId: '1097566930397',
	appId: '1:1097566930397:web:772cc59c8051e820fbe234',
	measurementId: 'G-LV8F398G03',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);


