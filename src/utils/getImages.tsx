import {
	getDownloadURL,
	listAll,
	ref,
} from 'firebase/storage';
import { storage } from '../config/firebase';
// Create a reference under which you want to list
const listAllImage = async (url: string) => {
	const filesFolderRef = ref(storage, `${url}/`);
	// Find all the prefixes and items.
	const imageUrlsFromFirebase: string[] = [];
	try {
		const data = await listAll(filesFolderRef);
		// data.prefixes.forEach((folderRef) => {
		// 	// All the prefixes under listRef.
		// 	// You may call listAll() recursively on them.
		// 	// console.log(folderRef);
		// });
		data.items.forEach((itemRef) => {
			// All the items under listRef.
			getDownloadURL(itemRef).then((url) => {
				imageUrlsFromFirebase.push(url);
			});
		});
	} catch (error) {
		console.error(error);
	}
	return imageUrlsFromFirebase;
};

export default listAllImage;
