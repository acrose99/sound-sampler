import React, { useState, useEffect } from 'react';

import { StyleSheet, View, FlatList, Platform, Text } from 'react-native';
import { SCREEN_WIDTH, getStatusBarHeight, isiPhoneX } from '../constants/Sizes';
import FileCard from './FileCard';
import * as FileSystem from 'expo-file-system';

import { getParentDirectory, getNameFromUri } from '../util/Parser';

const FileDisplay = (props) => {
	const {
		files,
		getDirectory,
		deleteFile,
		currentDirectory,
		setCurrentDirectory,
		moveFile,
		movingOptions,
		setMovingOptions
	} = props;
	const [ displayedFiles, setDisplayedFiles ] = useState(props.files);

	const onRequestDirectory = async (uri) => {
		const newFiles = [];
		await getDirectory(uri).then((directoryFiles) => {
			for (const file of directoryFiles) {
				newFiles.push(file);
			}
		});
		console.log(newFiles);
		setCurrentDirectory(uri + '/');
		console.log('Requested Directory: ' + uri);
		setDisplayedFiles(newFiles);
	};

	const onRequestDeleteFile = async (uri) => {
		console.log(uri);
		deleteFile(uri);
	};

	const onRequestMoveFile = async (uri) => {
		console.log(uri);
		setMovingOptions({
			areMoving: true,
			fromUri: uri,
			toUri: null
		});
		setCurrentDirectory(FileSystem.documentDirectory);
		alert('Transitioning into moving mode');
	};

	const getCard = (item, index) => {
		let marginStyle = {};
		if (displayedFiles.length - 1 === index) {
			if (isiPhoneX())
				marginStyle = {
					marginBottom: 214
				};
			else if (Platform.OS === 'ios') marginStyle = { marginBottom: 180 };
			else marginStyle = { marginBottom: 190 };
		}
		return (
			<FileCard
				bottomStyle={marginStyle}
				file={item}
				requestDirectory={onRequestDirectory}
				deleteFile={onRequestDeleteFile}
				moveFile={onRequestMoveFile}
				currentDirectory={currentDirectory}
			/>
		);
	};

	const getPageContent = (item, index) => {
		if (displayedFiles.length > 0) {
			return (
				<FlatList
					style={styles.list}
					data={displayedFiles}
					renderItem={({ item, index }) => getCard(item, index)}
					keyExtractor={(file) => file.uri}
				/>
			);
		} else {
			return <Text style={[ styles.list, styles.errorText ]}>No files found. Start recording to add some!</Text>;
		}
	};

	useEffect(
		() => {
			setDisplayedFiles(files);
		},
		[ files ]
	);

	return <View styles={styles.container}>{getPageContent()}</View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	list: {
		flex: 1,
		width: SCREEN_WIDTH,
		marginTop: 0
	},
	errorText: {
		marginTop: 20,
		fontSize: 16,
		textAlign: 'center',
		color: '#333'
	}
});

export default FileDisplay;
