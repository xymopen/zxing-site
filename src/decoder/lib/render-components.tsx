import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DecodeResult from "../components/decoderesult";
import Response from "../components/response";

const root = createRoot(document.getElementById("main")!);

export const render = (children: ReactNode): void => {
	root.render(<StrictMode>{children}</StrictMode >);
};

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		root.unmount();
	});
}

export const setDecodeResult = (): void => render(<DecodeResult />);

const error = {
	badimage: {
		title: "Bad Image",
		text: "The image you uploaded could not be decoded, or was too large. Go \"Back\" in your browser and try another image."
	},
	your: {
		title: "Bad URL",
		text: "You didn't specify a URL, or the URL was not valid, or did not return an image. Go \"Back\" in your browser and try again."
	},
	format: {
		title: "Barcode Format Problem",
		text: "A barcode was possibly found in this image, but a problem occurred while decoding it. The data did not conform to the barcode format. This could be due to a misdetection of the barcode, or could indicate a problem  with the barcode contents. Go \"Back\" in your browser and try another image."
	},
	notfound: {
		title: "No Barcode Found",
		text: "No barcode was found in this image. Either it did not contain a barcode, or did not contain one in a supported format, or the software was simply unable to find it. Go \"Back\" in your browser and try another image."
	},
} as const;

export const setErrorResponse = (key: keyof typeof error): void => render(<Response {...error[key]} />);
