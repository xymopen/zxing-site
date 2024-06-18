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

import { KeyboardEvent, Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { GeneratorEvent, GeneratorRef } from "../types/generator-types";
import { validateNumber, filterNumber } from "../lib/validators";

const SmsAddressGenerator = forwardRef((props: GeneratorEvent, ref: Ref<GeneratorRef>) => {
	const focusTargetRef = useRef<HTMLInputElement>(null);
	const focusRequested = useRef(false);

	const [number, setNumber] = useState("");
	const [message, setMessage] = useState("");

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

	const innerValidateMessage = useCallback(() => {
		{
			if (message.length > 150) {
				props.onInvalid("Sms message can not be longer than 150 characters.");
				return false;
			}
		}

		return true;
	}, [
		message,
		props.onInvalid
	]);

	const submit = useCallback(() => {
		if (innerValidateNumber() && innerValidateMessage()) {
			let output = number;
			// we add the text only if there actually is something in the field.
			if (message.length > 0) {
				output += ":" + message;
			}

			props.onSubmit(`smsto:${output}`);
		}
	}, [
		number,
		message,
		innerValidateNumber,
		props.onSubmit
	]);

	const keyPressHandler = useCallback((event: KeyboardEvent) => {
		if (event.charCode == ("\n").charCodeAt(0) || event.charCode == ("\r").charCodeAt(0)) {
			submit();
		}
	}, [submit]);

	useImperativeHandle(ref, () =>
		({
			submit,
			focus() {
				focusRequested.current = true;
			}
		})
	, [submit,
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
			<tr>
				<td className="firstColumn">
					Message
				</td>
				<td className="secondColumn">
					<textarea
						className="gwt-TextArea"
						value={message}
						onChange={event => setMessage(event.target.value)}
						onBlur={innerValidateMessage}
					/>
				</td>
			</tr>
		</tbody>
	</table>;
});

const key = "SMS" as const;

Object.defineProperty(SmsAddressGenerator, "key", {
	configurable: true,
	enumerable: true,
	value: key,
	writable: false
});

export default SmsAddressGenerator as typeof SmsAddressGenerator & { readonly key: typeof key };
