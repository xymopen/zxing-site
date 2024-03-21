const loadImage = (url: string): Promise<HTMLImageElement> =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const img = document.createElement("img");
		img.src = url;
		img.addEventListener("load", resolve.bind(undefined, img));
		img.addEventListener("error", ({ error }) => reject(error));
	});

export default loadImage;
