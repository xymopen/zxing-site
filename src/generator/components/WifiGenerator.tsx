/*
 * Copyright (C) 2010 ZXing authors
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

function WifiGenerator() {
	return <table>
		<tbody>
			<tr>
				<td className="firstColumn">
					SSID
				</td>
				<td className="secondColumn">
					<input className="gwt-TextBox required" type="text" />
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Password
				</td>
				<td className="secondColumn">
					<input className="gwt-TextBox" type="text" />
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Network Type
				</td>
				<td className="secondColumn">
					<select className="gwt-ListBox">
						<option value="WEP">WEP</option>
						<option value="WPA">WPA/WPA2</option>
						<option value="nopass">No encryption</option>
					</select>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Hidden?
				</td>
				<td className="secondColumn">
					<input className="gwt-CheckBox" type="checkbox" />
				</td>
			</tr>
		</tbody>
	</table>;
};

const key = "Wifi network" as const;

Object.defineProperty(WifiGenerator, "key", {
	configurable: true,
	enumerable: true,
	value: key,
	writable: false
});

export default WifiGenerator as typeof WifiGenerator & { readonly key: typeof key };
