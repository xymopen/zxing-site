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

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { GeneratorEvent, GeneratorRef } from "../types/generator-types";
import forwardAnyRef, { SetRef } from "../hook/forward-any-ref";

const TextGenerator = forwardAnyRef((props: GeneratorEvent, setRef: SetRef<GeneratorRef>) => {
	const focusTargetRef = useRef<HTMLTextAreaElement>(null);
	const focusRequested = useRef(false);

	const [text, setText] = useState("");

	const innerValidateText = useCallback(() => {
		{
			if (text.length === 0) {
				props.onInvalid("Text should be at least 1 character.");
				return false;
			}
		}

		return true;
	}, [
		text,
		props.onInvalid
	]);

	useEffect(() => {
		setRef({
			submit() {
				innerValidateText() &&
					props.onSubmit(text);
			},
			focus() {
				focusRequested.current = true;
			}
		});
	}, [forwardRef,
		text,
		innerValidateText,
		props.onSubmit]);

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
					Text content
				</td>
				<td className="secondColumn">
					<textarea
						ref={focusTargetRef}
						className="gwt-TextArea required"
						rows={5}
						value={text}
						onChange={event => setText(event.target.value)}
						onBlur={innerValidateText}
					/>
				</td>
			</tr>
		</tbody>
	</table>;
});

const key = "Text" as const;

Object.defineProperty(TextGenerator, "key", {
	configurable: true,
	enumerable: true,
	value: key,
	writable: false
});

export default TextGenerator as typeof TextGenerator & { readonly key: typeof key };
