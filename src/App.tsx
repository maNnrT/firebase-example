/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './App.css';
import Auth from './components/Auth';




import Movies from './components/Movies';
import Images from './components/Images';

function App() {
	

	return (
		<div className="App">
			<h1>Firebase Example</h1>
			<Auth />
			<Movies />
			<Images/>
		</div>
	);
}

export default App;
