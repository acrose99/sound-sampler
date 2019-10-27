import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import FileDisplay from './FileDisplay';
import { DUMMY_FILES } from '../constants/Dummy';
import * as FileSystem from 'expo-file-system';
import { create } from 'uuid-js';

const FileManager = (props) => {
	const [ files, setFiles ] = useState([]);

	const testFunction = async () => {
		//TEST FUNCTIONS
		deleteAllFiles();
		// await FileSystem.downloadAsync(
		//   "http://techslides.com/demos/sample-videos/small.mp4",
		//   FileSystem.documentDirectory + "small.mp4"
		// );

		directoryStatus = await createDirectory(FileSystem.documentDirectory, 'oogabooga');

		updateFiles();

		changeName(FileSystem.documentDirectory + 'oogabooga', 'arfarf');

		updateFiles();

		// await moveFile(
		//   FileSystem.documentDirectory + "small.mp4",
		//   FileSystem.documentDirectory + "oogabooga" + "/small.mp4"
		// );

		// console.log(
		//   await FileSystem.readDirectoryAsync(
		//     FileSystem.documentDirectory + "oogabooga"
		//   )
		// );

		console.log('TEST FUNCTION RUNNING');
	};

	const changeName = async (oldUri, newName) => {
		console.log('CHANGIN NAMES1');
		for (const info of files) {
			if (info.uri === oldUri) {
				console.log('COME HERE!');
				const options = {
					from: oldUri,
					to: oldUri - info.name + newName
				};
			}
		}
		console.log('DONT COME HERE FIRST!');
		await FileSystem.copyAsync(options);
	};

	const getDirectory = (uri) => {
		return makeFileList(uri);
	};
	const getFile = async (uri) => {
		const soundObject = new Audio.soundO();
		await soundObject.loadAsync({
			uri: FileSystem.documentDirectory + 'small.mp4'
		});
		return soundObject;
	};

	const createDirectory = async (uri, name) => {
		await FileSystem.makeDirectoryAsync(uri + name);
	};

	const makeFileList = async (
		uri //Default uri is 'FileSystem.documentDirectory'
	) => {
		let tempData = [];

		await FileSystem.readDirectoryAsync(uri).then(async (data) => {
			for (const file of data) {
				await FileSystem.getInfoAsync(FileSystem.documentDirectory + file).then(async (fileInfo) => {
					tempData.push({
						name: file,
						uri: FileSystem.documentDirectory + file,
						isDirectory: fileInfo.isDirectory
					});
				});
			}
		});
		return tempData;
	};

	const deleteAllFiles = async () => {
		FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then((data) => {
			data.forEach((file) => {
				FileSystem.deleteAsync(FileSystem.documentDirectory + file);
			});
		});
		updateFiles();
	};

	const deleteFile = async (uri) => {
		FileSystem.deleteAsync(uri);
	};

	const moveFile = async (oldUri, newUri) => {
		const options = {
			from: oldUri,
			to: newUri
		};
		await FileSystem.moveAsync(options);
	};

	const updateFiles = async () => {
		await makeFileList(FileSystem.documentDirectory).then((newFiles) => setFiles(newFiles));
	};

	const pullCache = async () => {
		const audioDirectoryName = Platform.OS === 'ios' ? 'AV/' : 'Audio/';
		const directoryName = FileSystem.cacheDirectory + audioDirectoryName;

		await FileSystem.readDirectoryAsync(directoryName).then((data) => {
			data.forEach((file) => {
				moveFile(directoryName + file, FileSystem.documentDirectory + file).then(() => {
					updateFiles();
				});
			});
		});
	};

	useEffect(() => {
		updateFiles();
		props.setIsLoading();
		testFunction();
	}, []);

	useEffect(
		() => {
			if (props.shouldCreateNewDirectory) {
				createDirectory(props.newDirectoryInformation.uri, props.newDirectoryInformation.name);
				updateFiles();
				props.onDirectoryCreate();
			}
		},
		[ props.shouldCreateNewDirectory ]
	);

	useEffect(
		() => {
			if (!props.isRecording) {
				pullCache();
			}
		},
		[ props.isRecording ]
	);

	return <FileDisplay files={files} getDirectory={getDirectory} getFile={getFile} />;
};

export default FileManager;
