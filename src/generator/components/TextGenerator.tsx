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

function TextGenerator() {
	return <table>
		<tbody>
			<tr>
				<td className="firstColumn">
					Text content
				</td>
				<td className="secondColumn">
					<textarea className="gwt-TextArea required" rows={5} />
				</td>
			</tr>
		</tbody>
	</table>;
};

const key = "Text" as const;

Object.defineProperty(TextGenerator, "key", {
	configurable: true,
	enumerable: true,
	value: key,
	writable: false
});

export default TextGenerator as typeof TextGenerator & { readonly key: typeof key };
