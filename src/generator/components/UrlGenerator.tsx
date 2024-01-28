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

function UrlGenerator() {
	return <table>
		<tbody>
			<tr>
				<td className="firstColumn">
					URL
				</td>
				<td className="secondColumn">
					<input className="gwt-TextBox required" type="text" value="http://" />
				</td>
			</tr>
		</tbody>
	</table>;
};

const key = "URL" as const;

Object.defineProperty(UrlGenerator, "key", {
	configurable: true,
	enumerable: true,
	value: key,
	writable: false
});

export default UrlGenerator as typeof UrlGenerator & { readonly key: typeof key };
