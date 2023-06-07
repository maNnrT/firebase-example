import { auth, googleProvider } from '../config/firebase';
import { useState } from 'react';
import {
	createUserWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
function Auth() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	console.log(auth.currentUser?.photoURL);

	const signIn = async () => {
		try {
			await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
		} catch (error) {
			console.error(error);
		}
	};
	const logOut = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error(error);
		}
	};
	const signInWithGoogle = async () => {
		try {
			await signInWithPopup(auth, googleProvider);
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div>
			<input
				type="text"
				placeholder="Email...."
				value={email}
				onChange={(event) => setEmail(event.target.value)}
			/>
			<input
				type="password"
				placeholder="Password...."
				value={password}
				onChange={(event) => setPassword(event.target.value)}
			/>
			<button onClick={signIn}>Sign up</button>
			<button onClick={logOut}>Log out</button>
			<button onClick={signInWithGoogle}>
				Sign up with Google
			</button>
		</div>
	);
}

export default Auth;
