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
import { validateUrl } from "../lib/validators";

const UrlGenerator = forwardRef((props: GeneratorEvent, forwardRef: ForwardedRef<GeneratorRef>) => {
	const focusTargetRef = useRef<HTMLInputElement>(null);
	const focusRequested = useRef(false);

	const [url, setUrl] = useState("http://");

	const innerValidateUrl = useCallback(() => {
		const reason = validateUrl(url);

		if (reason !== true) {
			props.onInvalid(reason);
			return false;
		}

		return true;
	}, [
		url,
		props.onInvalid
	]);

	const submit = useCallback(() => {
		innerValidateUrl() &&
			props.onSubmit(url);
	}, [
		url,
		innerValidateUrl,
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
					URL
				</td>
				<td className="secondColumn">
					<input
						ref={focusTargetRef}
						className="gwt-TextBox required"
						type="text"
						value={url}
						onChange={event => setUrl(event.target.value)}
						onBlur={innerValidateUrl}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
		</tbody>
	</table>;
});

const key = "URL" as const;

Object.defineProperty(UrlGenerator, "key", {
	configurable: true,
	enumerable: true,
	value: key,
	writable: false
});

export default UrlGenerator as typeof UrlGenerator & { readonly key: typeof key };
