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

import { ForwardedRef, forwardRef, useEffect, useRef } from "react";
import { GeneratorEvent, GeneratorRef } from "../types/generator-types";
import setForwardRef from "../lib/set-forward-ref";

const TextGenerator = forwardRef((props: GeneratorEvent, forwardRef: ForwardedRef<GeneratorRef>) => {
	const focusTargetRef = useRef<HTMLTextAreaElement>(null);
	const focusRequested = useRef(false);

	useEffect(() => {
		setForwardRef(forwardRef, {
			submit() {

			},
			focus() {
				focusRequested.current = true;
			}
		});
	}, [
		forwardRef,
		props.onInvalid,
		props.onSubmit
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
					Text content
				</td>
				<td className="secondColumn">
					<textarea ref={focusTargetRef} className="gwt-TextArea required" rows={5} />
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
