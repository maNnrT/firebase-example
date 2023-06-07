import { useLayoutEffect, useState } from 'react';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
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
interface InputUpdateProps {
	getMovieList: () => void;
	id: string;
}
function InputUpdate({
	getMovieList,
	id,
}: InputUpdateProps) {
	const [updatedTitle, setUpdatedTitle] = useState('');

	const updateMovieTitle = async (id: string) => {
		const movieDoc = doc(db, 'movies', id);
		await updateDoc(movieDoc, { title: updatedTitle });
		getMovieList();
	};
	return (
		<div>
			<input
				type="text"
				placeholder="New Title"
				value={updatedTitle}
				onChange={(e) => setUpdatedTitle(e.target.value)}
			/>
			<button onClick={() => updateMovieTitle(id)}>
				Update title
			</button>
		</div>
	);
}
function Movies() {
	const [moviesList, setMoviesList] = useState<Movie[]>([]);
	const [moviesTitles, setMoviesTitles] = useState('');
	const [moviesReleaseDate, setMoviesReleaseDate] =
		useState(0);
	const [moviesReceivedOscar, setMoviesReceivedOscar] =
		useState(false);
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

	useLayoutEffect(() => {
		getMovieList();
	}, []);
	return (
		<>
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
							<InputUpdate
								getMovieList={getMovieList}
								id={movie.id}
							/>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default Movies;
