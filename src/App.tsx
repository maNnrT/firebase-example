import { useEffect, useState } from 'react';
import './App.css';
import Auth from './components/Auth';
import { db, auth, storage } from './config/firebase';
import {
	getDocs,
	collection,
	addDoc,
	deleteDoc,
	doc,
	updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
	const [moviesList, setMoviesList] = useState([]);
	const [moviesTitles, setMoviesTitles] = useState('');
	const [moviesReleaseDate, setMoviesReleaseDate] =
		useState(0);
	const [moviesReceivedOscar, setMoviesReceivedOscar] =
		useState(false);
	const [updatedTitle, setUpdatedTitle] = useState('');
	const [fileUpload, setFileUpload] = useState(null);
	const moviesCollection = collection(db, 'movies');

	const getMovieList = async () => {
		try {
			const data = await getDocs(moviesCollection);
			const filteredData = data.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));
			setMoviesList(filteredData);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		getMovieList();
	}, []);

	const onSubmitMovie = async () => {
		try {
			await addDoc(moviesCollection, {
				title: moviesTitles,
				releaseDate: moviesReleaseDate,
				receivedAnOscar: moviesReceivedOscar,
				userId: auth?.currentUser?.uid,
			});
			getMovieList();
		} catch (err) {
			console.error(err);
		}
	};

	const deleteMovie = async (id) => {
		const movieDoc = doc(db, 'movies', id);
		await deleteDoc(movieDoc);
		getMovieList();
	};

	const updateMovieTitle = async (id) => {
		const movieDoc = doc(db, 'movies', id);
		await updateDoc(movieDoc, { title: updatedTitle });
		getMovieList();
	};

	const uploadFile = async (id) => {
		if (!fileUpload) {
			return;
		}
		const filesFolderRef = ref(
			storage,
			`projectFiles/${fileUpload.name}`
		);
		try {
			await uploadBytes(filesFolderRef, fileUpload);
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div className="App">
			<h1>Vite + React</h1>
			<Auth />
			<div>
				<input
					type="text"
					placeholder="Movies title..."
					value={moviesTitles}
					onChange={(e) => setMoviesTitles(e.target.value)}
				/>
				<input
					type="number"
					placeholder="Release date..."
					value={moviesReleaseDate}
					onChange={(e) =>
						setMoviesReleaseDate(Number(e.target.value))
					}
				/>
				<input
					type="checkbox"
					id="oscar"
					checked={moviesReceivedOscar}
					onChange={() =>
						setMoviesReceivedOscar(!moviesReceivedOscar)
					}
				/>
				<label htmlFor="oscar">Received an Oscar</label>
				<button onClick={onSubmitMovie}>Add Movie</button>
			</div>
			<div>
				{moviesList.map((movie) => {
					return (
						<div key={movie.id}>
							<h2
								style={{
									color: movie.receivedAnOscar ? 'green' : 'red',
								}}
							>
								{movie.title}
							</h2>
							<p>Date:{movie.releaseDate}</p>
							<button onClick={() => deleteMovie(movie.id)}>
								Delete
							</button>
							<input
								type="text"
								placeholder="New Title"
								value={updatedTitle}
								onChange={(e) => setUpdatedTitle(e.target.value)}
							/>
							<button onClick={() => updateMovieTitle(movie.id)}>
								Update title
							</button>
						</div>
					);
				})}
			</div>
			<div>
				<input
					type="file"
					name=""
					id=""
					onChange={(e) => setFileUpload(e.target.files[0])}
				/>
				<button onClick={uploadFile}>Upload File</button>
			</div>
		</div>
	);
}

export default App;
