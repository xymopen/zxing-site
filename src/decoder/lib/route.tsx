import { BarcodeFormat, Result, ResultPoint } from "@zxing/library";
import Decode from "../components/decode";
import DecodeResult from "../components/decoderesult";
import Response from "../components/response";
import render from "./render";

type SerializedResult = {
	text: string;
	rawBytes: Uint8Array;
	numBits: number;
	resultPoints: {
		x: number;
		y: number;
	}[],
	format: BarcodeFormat;
	timestamp: number;
};

const serializeResult = (result: Result): SerializedResult => ({
	text: result.getText(),
	rawBytes: result.getRawBytes(),
	numBits: result.getNumBits(),
	resultPoints: result.getResultPoints().map(point => ({
		x: point.getX(),
		y: point.getY()
	})),
	format: result.getBarcodeFormat(),
	timestamp: result.getTimestamp()
});

const deserializeResult = (result: SerializedResult): Result => new Result(
	result.text,
	result.rawBytes,
	result.numBits,
	result.resultPoints.map(point => new ResultPoint(point.x, point.y)),
	result.format,
	result.timestamp
);

type DecodeResultRouteData = {
	view: "decoderesult";
	results: SerializedResult[];
};

const isDecodeResultRouteData = (value: unknown): value is DecodeResultRouteData =>
	value != null &&
	(value as any).view === "decoderesult" &&
	// TODO: Better determine results
	Array.isArray((value as any).results);

type ResponseRouteData = { view: "response"; key: keyof typeof error; };

const isResponseRouteData = (value: unknown): value is ResponseRouteData =>
	value != null &&
	(value as any).view === "response" &&
	Object.prototype.hasOwnProperty.call(error, (value as any).key);

export const setRoute = () => {
	const { state } = history;

	if (state != null) {
		if (isDecodeResultRouteData(state)) {
			render(<DecodeResult results={state.results.map(deserializeResult)} />);
			return;
		} else if (isResponseRouteData(state)) {
			render(<Response {...error[state.key]} />);
			return;
		}
	}
	render(<Decode />);
};

export const setDecodeResult = (results: Result[]): void => {
	history.pushState({ view: "decoderesult", results: results.map(serializeResult) } satisfies DecodeResultRouteData, "");
	render(<DecodeResult results={results} />);
};

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

export const setErrorResponse = (key: keyof typeof error): void => {
	history.pushState({ view: "response", key: key } satisfies ResponseRouteData, "");
	render(<Response {...error[key]} />);
};
