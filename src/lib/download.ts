const download = (url: string, filename: string): void => {
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
};

export default download;
