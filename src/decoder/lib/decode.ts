import { setDecodeResult, setErrorResponse } from "./route";
import { BinaryBitmap, DecodeHintType, Exception, GlobalHistogramBinarizer, HybridBinarizer, MultiFormatReader, NotFoundException, Result } from "@zxing/library";
import { HTMLCanvasElementLuminanceSource } from "@zxing/browser";
import GenericMultipleBarcodeReader from "./multi/GenericMultipleBarcodeReader";

const mapOf = <K extends PropertyKey, V>(literal: Record<K, V>): Map<K, V> =>
	new Map(Object.entries(literal) as [K, V][]);

const isException = (value: unknown): value is Exception =>
	value instanceof Exception || (value instanceof Error && typeof (value as Exception).getKind === "function");

const loadImage = (file: File | string | null): Promise<null | HTMLCanvasElement> => {
	if (file == null || typeof file === "string") {
		return Promise.resolve(null);
	} else {
		const url = URL.createObjectURL(file);

		return new Promise<null | HTMLCanvasElement>((resolve, reject) => {
			const img = document.createElement("img");
			img.src = url;
			img.addEventListener("load", () => {
				const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext("2d")!;
				ctx.drawImage(img, 0, 0);
				resolve(canvas);
			});
			img.addEventListener("error", reject);
		}).finally(() => {
			URL.revokeObjectURL(url);
		});
	}
};

const processImage = (canvas: HTMLCanvasElement) => {
	const source = new HTMLCanvasElementLuminanceSource(canvas);
	const bitmap = new BinaryBitmap(new GlobalHistogramBinarizer(source));
	const results: Result[] = [];

	const reader = new MultiFormatReader();
	let savedException: unknown = null;

	{
		try {
			// Look for multiple barcodes
			const multiReader = new GenericMultipleBarcodeReader(reader);
			const theResults = multiReader.decodeMultiple(bitmap, mapOf({
				[DecodeHintType.TRY_HARDER]: true,
				[DecodeHintType.POSSIBLE_FORMATS]: true,
			}));
			if (theResults != null) {
				results.push(...theResults);
			}
		} catch (re) {
			savedException = re;
		}
	}

	if (results.length === 0) {
		try {
			// Look for pure barcode
			const result = reader.decode(bitmap, mapOf({ [DecodeHintType.PURE_BARCODE]: true }));
			if (result != null) {
				results.push(result);
			}
		} catch (re) {
			savedException = re;
		}
	}

	if (results.length === 0) {
		try {
			// Look for normal barcode
			const result = reader.decode(bitmap, mapOf({
				[DecodeHintType.TRY_HARDER]: true,
				[DecodeHintType.POSSIBLE_FORMATS]: true,
			}));
			if (result != null) {
				results.push(result);
			}
		} catch (re) {
			savedException = re;
		}
	}

	if (results.length === 0) {
		try {
			// Try again with other binarizer
			const hybridBitmap = new BinaryBitmap(new HybridBinarizer(source));
			const result = reader.decode(hybridBitmap, mapOf({
				[DecodeHintType.TRY_HARDER]: true,
				[DecodeHintType.POSSIBLE_FORMATS]: true,
			}));
			if (result != null) {
				results.push(result);
			}
		} catch (re) {
			savedException = re;
		}
	}

	if (results.length === 0) {
		savedException ??= NotFoundException.getNotFoundInstance();

		if (isException(savedException)) {
			if (savedException.getKind() === "FormatException" || savedException.getKind() === "ChecksumException") {
				setErrorResponse("format");
			} else if (savedException.getKind() === "ReaderException" || savedException.getKind() === "NotFoundException") {
				setErrorResponse("notfound");
			}
		}

		// Unexpected exception from library
	} else {
		setDecodeResult(results);
	}
};

const processFormData = async (formData: FormData) => {
	const canvas = await loadImage(formData.get("f"));

	if (canvas == null) {
		setErrorResponse("badimage");
	} else {
		const height = canvas.height;
		const width = canvas.width;
		if (height <= 1 || width <= 1) {
			console.info(`Dimensions too small: ${width}x${height}`);
			setErrorResponse("badimage");
		} else {
			processImage(canvas);
		}
	}
};

export default processFormData;
