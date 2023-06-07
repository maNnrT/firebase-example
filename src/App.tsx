/* eslint-disable react-hooks/exhaustive-deps */
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
import {
	getDownloadURL,
	listAll,
	ref,
	uploadBytes,
} from 'firebase/storage';
type Movie = {
	id: string;
	title: string;
	releaseDate: number;
	receivedAnOscar: boolean;
};
type Doc = {
	id: string;
	title: string;
	releaseDate: number;
	receivedAnOscar: boolean;
};

function App() {
	const [moviesList, setMoviesList] = useState<Movie[]>([]);
	const [moviesTitles, setMoviesTitles] = useState('');
	const [moviesReleaseDate, setMoviesReleaseDate] =
		useState(0);
	const [moviesReceivedOscar, setMoviesReceivedOscar] =
		useState(false);
	const [updatedTitle, setUpdatedTitle] = useState('');
	const [fileUpload, setFileUpload] = useState<File>();
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const moviesCollection = collection(db, 'movies');

	const getMovieList = async () => {
		try {
			const data = await getDocs(moviesCollection);
			const filteredData: Doc[] = data.docs.map((doc) => ({
				id: doc.id,
				title: doc.data().title,
				releaseDate: doc.data().releaseDate,
				receivedAnOscar: doc.data().receivedAnOscar,
			}));
			setMoviesList(filteredData);
		} catch (err) {
			console.error(err);
		}
	};

	
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

	const deleteMovie = async (id: string) => {
		const movieDoc = doc(db, 'movies', id);
		await deleteDoc(movieDoc);
		getMovieList();
	};

	const updateMovieTitle = async (id: string) => {
		const movieDoc = doc(db, 'movies', id);
		await updateDoc(movieDoc, { title: updatedTitle });
		getMovieList();
	};

	const uploadFile = async () => {
		if (!fileUpload) {
			return;
		}
		const filesFolderRef = ref(
			storage,
			`projectFiles/${fileUpload.name}`
		);
		try {
			await uploadBytes(filesFolderRef, fileUpload).then(
				(snapshot) => {
					getDownloadURL(snapshot.ref).then((url) => {
						setImageUrls((prev) => [...prev, url]);
					});
				}
			);
		} catch (error) {
			console.error(error);
		}
  };
  useEffect(() => {
		getMovieList();
	}, []);
  useEffect(() => {
    const filesFolderRef = ref(
			storage,
			`projectFiles/`
		);
    listAll(filesFolderRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);
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
					onChange={(e) =>
						e.target.files && setFileUpload(e.target.files[0])
					}
				/>
				<button onClick={uploadFile}>Upload File</button>
				{imageUrls.map((url) => {
					return <img src={url} />;
				})}
			</div>
		</div>
	);
}

export default App;
