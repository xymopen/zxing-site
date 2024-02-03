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

import { BinaryBitmap, DecodeHintType, Exception, Reader, Result, ResultPoint } from "@zxing/library";

/**
 * This class attempts to decode a barcode from an image, not by scanning the whole image,
 * but by scanning subsets of the image. This is important when there may be multiple barcodes in
 * an image, and detecting a barcode may find parts of multiple barcode and fail to decode
 * (e.g. QR Codes). Instead this scans the four quadrants of the image -- and also the center
 * 'quadrant' to cover the case where a barcode is found in the center.
 *
 * @see GenericMultipleBarcodeReader
 */
export default class ByQuadrantReader implements Reader {

	private delegate;

	constructor(delegate: Reader) {
		this.delegate = delegate;
	}

	/**
	 * @throws NotFoundException
	 * @throws ChecksumException
	 * @throws FormatException
	 */
	/*@Override*/
	decode(image: BinaryBitmap, hints?: Map<DecodeHintType, any> | null): Result {

		let width = image.getWidth();
		let height = image.getHeight();
		let halfWidth = width / 2;
		let halfHeight = height / 2;

		try {
			// No need to call makeAbsolute as results will be relative to original top left here
			return this.delegate.decode(image.crop(0, 0, halfWidth, halfHeight), hints);
		} catch (re) {
			if ((re as Exception)?.getKind() === "NotFoundException") {
				// continue
			} else {
				throw re;
			}
		}

		try {
			let result: Result = this.delegate.decode(image.crop(halfWidth, 0, halfWidth, halfHeight), hints);
			ByQuadrantReader.makeAbsolute(result.getResultPoints(), halfWidth, 0);
			return result;
		} catch (re) {
			if ((re as Exception)?.getKind() === "NotFoundException") {
				// continue
			} else {
				throw re;
			}
		}

		try {
			let result: Result = this.delegate.decode(image.crop(0, halfHeight, halfWidth, halfHeight), hints);
			ByQuadrantReader.makeAbsolute(result.getResultPoints(), 0, halfHeight);
			return result;
		} catch (re) {
			if ((re as Exception)?.getKind() === "NotFoundException") {
				// continue
			} else {
				throw re;
			}
		}

		try {
			let result: Result = this.delegate.decode(image.crop(halfWidth, halfHeight, halfWidth, halfHeight), hints);
			ByQuadrantReader.makeAbsolute(result.getResultPoints(), halfWidth, halfHeight);
			return result;
		} catch (re) {
			if ((re as Exception)?.getKind() === "NotFoundException") {
				// continue
			} else {
				throw re;
			}
		}

		let quarterWidth = halfWidth / 2;
		let quarterHeight = halfHeight / 2;
		let center = image.crop(quarterWidth, quarterHeight, halfWidth, halfHeight);
		let result = this.delegate.decode(center, hints);
		ByQuadrantReader.makeAbsolute(result.getResultPoints(), quarterWidth, quarterHeight);
		return result;
	}

	/*@Override*/
	reset(): void {
		this.delegate.reset();
	}

	private static makeAbsolute(points: ResultPoint[], leftOffset: number, topOffset: number): void {
		if (points != null) {
			for (let i = 0; i < points.length; i++) {
				let relative: ResultPoint = points[i];
				if (relative != null) {
					points[i] = new ResultPoint(relative.getX() + leftOffset, relative.getY() + topOffset);
				}
			}
		}
	}

}
