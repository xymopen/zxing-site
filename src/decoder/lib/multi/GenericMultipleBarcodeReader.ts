/*
 * Copyright 2009 ZXing authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Result, Reader, BinaryBitmap, DecodeHintType, NotFoundException, ResultPoint } from "@zxing/library";
import MultipleBarcodeReader from "@zxing/library/esm/core/multi/MultipleBarcodeReader";

/**
 * <p>Attempts to locate multiple barcodes in an image by repeatedly decoding portion of the image.
 * After one barcode is found, the areas left, above, right and below the barcode's
 * {@link ResultPoint}s are scanned, recursively.</p>
 *
 * <p>A caller may want to also employ {@link ByQuadrantReader} when attempting to find multiple
 * 2D barcodes, like QR Codes, in an image, where the presence of multiple barcodes might prevent
 * detecting any one of them.</p>
 *
 * <p>That is, instead of passing a {@link Reader} a caller might pass
 * {@code new ByQuadrantReader(reader)}.</p>
 *
 * @author Sean Owen
 */
export default class GenericMultipleBarcodeReader implements MultipleBarcodeReader {

	private static MIN_DIMENSION_TO_RECUR = 100;
	private static MAX_DEPTH = 4;

	static EMPTY_RESULT_ARRAY: Result[] = [];

	private delegate: Reader;

	constructor(delegate: Reader) {
		this.delegate = delegate;
	}

	/**
	 * @throws NotFoundException
	 */
	/*@Override*/
	decodeMultiple(image: BinaryBitmap, hints?: Map<DecodeHintType, any> | null): Result[] {
		let results: Result[] = [];
		this.doDecodeMultiple(image, hints, results, 0, 0, 0);
		if (results.length === 0) {
			throw NotFoundException.getNotFoundInstance();
		}
		return results;
	}

	private doDecodeMultiple(image: BinaryBitmap,
		hints: Map<DecodeHintType, any> | null | undefined,
		results: Result[],
		xOffset: number,
		yOffset: number,
		currentDepth: number): void {
		if (currentDepth > GenericMultipleBarcodeReader.MAX_DEPTH) {
			return;
		}

		let result: Result;
		try {
			result = this.delegate.decode(image, hints);
		} catch (ignored) {
			// ReaderException
			return;
		}
		let alreadyFound = false;
		for (let existingResult of results) {
			if (existingResult.getText() === result.getText()) {
				alreadyFound = true;
				break;
			}
		}
		if (!alreadyFound) {
			results.push(GenericMultipleBarcodeReader.translateResultPoints(result, xOffset, yOffset));
		}
		let resultPoints = result.getResultPoints();
		if (resultPoints == null || resultPoints.length == 0) {
			return;
		}
		let width = image.getWidth();
		let height = image.getHeight();
		let minX = width;
		let minY = height;
		let maxX = 0;
		let maxY = 0;
		for (let point of resultPoints) {
			if (point == null) {
				continue;
			}
			let x = point.getX();
			let y = point.getY();
			if (x < minX) {
				minX = x;
			}
			if (y < minY) {
				minY = y;
			}
			if (x > maxX) {
				maxX = x;
			}
			if (y > maxY) {
				maxY = y;
			}
		}

		// Decode left of barcode
		if (minX > GenericMultipleBarcodeReader.MIN_DIMENSION_TO_RECUR) {
			this.doDecodeMultiple(image.crop(0, 0, minX, height),
				hints, results,
				xOffset, yOffset,
				currentDepth + 1);
		}
		// Decode above barcode
		if (minY > GenericMultipleBarcodeReader.MIN_DIMENSION_TO_RECUR) {
			this.doDecodeMultiple(image.crop(0, 0, width, minY),
				hints, results,
				xOffset, yOffset,
				currentDepth + 1);
		}
		// Decode right of barcode
		if (maxX < width - GenericMultipleBarcodeReader.MIN_DIMENSION_TO_RECUR) {
			this.doDecodeMultiple(image.crop(maxX, 0, width - maxX, height),
				hints, results,
				xOffset + maxX, yOffset,
				currentDepth + 1);
		}
		// Decode below barcode
		if (maxY < height - GenericMultipleBarcodeReader.MIN_DIMENSION_TO_RECUR) {
			this.doDecodeMultiple(image.crop(0, maxY, width, height - maxY),
				hints, results,
				xOffset, yOffset + maxY,
				currentDepth + 1);
		}
	}

	private static translateResultPoints(result: Result, xOffset: number, yOffset: number): Result {
		let oldResultPoints = result.getResultPoints();
		if (oldResultPoints == null) {
			return result;
		}
		let newResultPoints: ResultPoint[] = [];
		for (let i = 0; i < oldResultPoints.length; i++) {
			let oldPoint = oldResultPoints[i];
			if (oldPoint != null) {
				newResultPoints[i] = new ResultPoint(oldPoint.getX() + xOffset, oldPoint.getY() + yOffset);
			}
		}
		let newResult = new Result(result.getText(),
			result.getRawBytes(),
			result.getNumBits(),
			newResultPoints,
			result.getBarcodeFormat(),
			result.getTimestamp());
		newResult.putAllMetadata(result.getResultMetadata());
		return newResult;
	}

};
