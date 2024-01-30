/*
 * Copyright (C) 2008 ZXing authors
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

import { ForwardedRef, KeyboardEvent, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { GeneratorEvent, GeneratorRef } from "../types/generator-types";
import setForwardRef from "../lib/set-forward-ref";

const LON_REGEXP = /^[+\-]?\d+(?:\.\d+)?$/;
const LAT_REGEXP = /^[+\-]?\d+(?:\.\d+)?$/;

const GeoLocationGenerator = forwardRef((props: GeneratorEvent, forwardRef: ForwardedRef<GeneratorRef>) => {
	const focusTargetRef = useRef<HTMLInputElement>(null);
	const focusRequested = useRef(false);

	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [query, setQuery] = useState("");

	const innerValidateLatitude = useCallback(() => {
		{

			if (!(LAT_REGEXP).test(latitude)) {
				props.onInvalid("Latitude is not a correct value.");
				return false;
			}
		}

		{
			const val = parseFloat(latitude);
			if (val < -90 || val > 90) {
				props.onInvalid("Latitude must be in [-90:90]");
				return false;
			}

		}

		return true;
	}, [
		latitude,
		props.onInvalid
	]);

	const innerValidateLongitude = useCallback(() => {
		{

			if (!(LON_REGEXP).test(longitude)) {
				props.onInvalid("Longitude is not a correct value.");
				return false;
			}
		}

		{
			const val = parseFloat(longitude);
			if (val < -180 || val > 180) {
				props.onInvalid("Longitude must be in [-180:180]");
				return false;
			}

		}

		return true;
	}, [
		longitude,
		props.onInvalid
	]);

	const submit = useCallback(() => {
		if (innerValidateLatitude() && innerValidateLongitude()) {
			let lat = latitude;
			let lon = longitude;

			if (query.length > 0) {
				const que = query.replace(/&/g, "%26");
				const lat = latitude.length == 0 ? "0" : latitude;
				const lon = longitude.length == 0 ? "0" : longitude;
				props.onSubmit(`geo:${lat},${lon}?q=${que}`);
			} else {
				props.onSubmit(`geo:${lat},${lon}`);
			}
		}
	}, [
		latitude,
		longitude,
		query,
		innerValidateLatitude,
		innerValidateLongitude,
		props.onSubmit
	]);

	const keyPressHandler = useCallback((event: KeyboardEvent) => {
		if (event.charCode == ("\n").charCodeAt(0) || event.charCode == ("\r").charCodeAt(0)) {
			submit();
		}
	}, [submit]);

	useEffect(() => {
		setForwardRef(forwardRef, {
			submit,
			focus() {
				focusRequested.current = true;
			}
		});
	}, [
		submit,
		forwardRef
	]);

	useEffect(() => {
		if (focusRequested.current && focusTargetRef.current != null) {
			focusTargetRef.current.focus();
			focusRequested.current = false;
		}
	}, [focusTargetRef]);

	return <table>
		<tbody>
			<tr>
				<td className="firstColumn">
					Latitude
				</td>
				<td className="secondColumn">
					<input
						ref={focusTargetRef}
						className="gwt-TextBox required"
						type="text"
						value={latitude}
						onChange={event => setLatitude(event.target.value)}
						onBlur={innerValidateLatitude}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Longitude
				</td>
				<td className="secondColumn">
					<input
						className="gwt-TextBox required"
						type="text"
						value={longitude}
						onChange={event => setLongitude(event.target.value)}
						onBlur={innerValidateLongitude}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Query
				</td>
				<td className="secondColumn">
					<input
						className="gwt-TextBox"
						type="text"
						value={query}
						onChange={event => setQuery(event.target.value)}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
		</tbody>
	</table>;
});

const key = "Geo location" as const;

Object.defineProperty(GeoLocationGenerator, "key", {
	configurable: true,
	enumerable: true,
	value: key,
	writable: false
});

export default GeoLocationGenerator as typeof GeoLocationGenerator & { readonly key: typeof key };
