import { useEffect, useState } from 'react';
import { storage } from '../config/firebase';
import {
	getDownloadURL,
	listAll,
	ref,
	uploadBytes,
} from 'firebase/storage';
// import listAllImage from '../utils/getImages';

function Images() {
	const [fileUpload, setFileUpload] = useState<File>();
	const [imageUrls, setImageUrls] = useState<string[]>([]);
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
	// const getAllImages = async () => {
	// 	setImageUrls(await listAllImage('projectFiles'));
	// };
	const getAllImages = async () => {
		const filesFolderRef = ref(storage, `projectFiles/`);
		// const imageUrlsFromFirebase: string[] = [];

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
					setImageUrls((pre) => [...pre, url]);
				});
			});
		} catch (error) {
			console.error(error);
		}

		// setImageUrls(imageUrlsFromFirebase);
	};
	useEffect(() => {
		console.log('ssssssssssssssssssssss');
		getAllImages();
	}, []);
	return (
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
				return (
					<img
						src={url}
						key={url}
					/>
				);
			})}
		</div>
	);
}

export default Images;
