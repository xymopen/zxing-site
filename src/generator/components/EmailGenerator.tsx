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
import { validateEmail } from "../lib/validators";

const EmailGenerator = forwardRef((props: GeneratorEvent, ref: Ref<GeneratorRef>) => {
	const focusTargetRef = useRef<HTMLInputElement>(null);
	const focusRequested = useRef(false);

	const [email, setEmail] = useState("");

	const innerValidateEmail = useCallback(() => {
		{
			if (email.length === 0) {
				props.onInvalid("Email must be present.");
				return false;
			}
		}

		{
			const reason = validateEmail(email);

			if (reason !== true) {
				props.onInvalid(reason);
				return false;
			}
		}

		return true;
	}, [
		email,
		props.onInvalid
	]);

	const submit = useCallback(() => {
		innerValidateEmail() &&
			props.onSubmit(`mailto:${email}`);
	}, [
		email,
		innerValidateEmail,
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
					Address
				</td>
				<td className="secondColumn">
					<input
						ref={focusTargetRef}
						className="gwt-TextBox required"
						type="text"
						value={email}
						onChange={event => setEmail(event.target.value)}
						onBlur={innerValidateEmail}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
		</tbody>
	</table>;
});

const key = "Email address" as const;

Object.defineProperty(EmailGenerator, "key", {
	configurable: true,
	enumerable: true,
	value: key,
	writable: false
});

export default EmailGenerator as typeof EmailGenerator & { readonly key: typeof key };
