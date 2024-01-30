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

import { KeyboardEvent, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { GeneratorEvent, GeneratorRef } from "../types/generator-types";
import forwardAnyRef, { SetRef } from "../hook/forward-any-ref";
import { validateNumber, filterNumber } from "../lib/validators";

const PhoneNumberGenerator = forwardAnyRef((props: GeneratorEvent, setRef: SetRef<GeneratorRef>) => {
	const focusTargetRef = useRef<HTMLInputElement>(null);
	const focusRequested = useRef(false);

	const [number, setNumber] = useState("");

	const innerValidateNumber = useCallback(() => {
		{
			if (number.length === 0) {
				props.onInvalid("Phone number must be present.");
				return false;
			}
		}

		{
			const reason = validateNumber(filterNumber(number));

			if (reason !== true) {
				props.onInvalid(reason);
				return false;
			}
		}

		return true;
	}, [
		number,
		props.onInvalid
	]);

	const submit = useCallback(() => {
		innerValidateNumber() &&
			props.onSubmit(`tel:${number}`);
	}, [
		number,
		innerValidateNumber,
		props.onSubmit
	]);

	const keyPressHandler = useCallback((event: KeyboardEvent) => {
		if (event.charCode == ("\n").charCodeAt(0) || event.charCode == ("\r").charCodeAt(0)) {
			submit();
		}
	}, [submit]);

	useEffect(() => {
		setRef({
			submit,
			focus() {
				focusRequested.current = true;
			}
		});
	}, [submit,
		forwardRef]);

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
					Phone number
				</td>
				<td className="secondColumn">
					<input
						ref={focusTargetRef}
						className="gwt-TextBox required"
						type="text"
						value={number}
						onChange={event => setNumber(event.target.value)}
						onBlur={innerValidateNumber}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
		</tbody>
	</table>;
});

const key = "Phone number" as const;

Object.defineProperty(PhoneNumberGenerator, "key", {
	configurable: true,
	enumerable: true,
	value: key,
	writable: false
});

export default PhoneNumberGenerator as typeof PhoneNumberGenerator & { readonly key: typeof key };
