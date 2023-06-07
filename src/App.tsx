/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import Auth from './components/Auth';
import Movies from './components/Movies';
import Images from './components/Images';
function App() {
	return (
		<div className="App">
			<h1>Firebase</h1>
			<Auth />
			<Movies />
			<Images />
		</div>
	);
}

export default App;
