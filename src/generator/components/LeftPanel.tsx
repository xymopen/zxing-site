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

import { useState } from "react";
import ContactInfoGenerator from "./ContactInfoGenerator";
import EmailGenerator from "./EmailGenerator";
import GeoLocationGenerator from "./GeoLocationGenerator";
import PhoneNumberGenerator from "./PhoneNumberGenerator";
import SmsAddressGenerator from "./SmsAddressGenerator";
import TextGenerator from "./TextGenerator";
import UrlGenerator from "./UrlGenerator";
import WifiGenerator from "./WifiGenerator";

const generators = [
	ContactInfoGenerator,
	EmailGenerator,
	GeoLocationGenerator,
	PhoneNumberGenerator,
	SmsAddressGenerator,
	TextGenerator,
	UrlGenerator,
	WifiGenerator,
];

type GeneratorKey = (typeof generators)[number]["key"];

const generatorMap = new Map(generators.map((generator) => [generator.key, generator]));

function LeftPanel() {
	const [selectedGeneratorKey, setSelectedGeneratorKey] = useState(() => generators[0].key as GeneratorKey);

	// fills up the list of generators
	const genList = <select
		className="gwt-ListBox"
		value={selectedGeneratorKey}
		onChange={event => {
			// updates the second row of the table with the content of the selected generator
			setSelectedGeneratorKey(event.target.value as GeneratorKey);
		}}
	>
		{generators.map((generator) => {
			const widget = <option key={generator.key} value={generator.key}>{generator.key}</option>;
			return widget;
		})}
	</select>;

	const sizeList = <select className="gwt-ListBox" value={350}>
		<option value={120}>Small</option>
		<option value={230}>Medium</option>
		<option value={350}>Large</option>
	</select>;

	const ecLevelList = <select className="gwt-ListBox" value="L">
		<option value="L">L</option>
		<option value="M">M</option>
		<option value="Q">Q</option>
		<option value="H">H</option>
	</select>;

	const encodingList = <select className="gwt-ListBox" value="UTF-8">
		<option value="UTF-8">UTF-8</option>
		<option value="ISO-8859-1">ISO-8859-1</option>
		<option value="Shift_JIS">Shift_JIS</option>
	</select>;

	// grid for the generator picker
	const selectionTable = <table>
		<tbody>
			<tr>
				<td className="firstColumn">Contents</td>
				<td className="secondColumn">{genList}</td>
			</tr>
		</tbody>
	</table>;

	// grid for the generate button
	const generateGrid = <table>
		<tbody>
			<tr>
				<td className="firstColumn" />
				<td className="secondColumn">
					<button className="gwt-Button">Generate &rarr;</button>
				</td>
			</tr>
		</tbody>
	</table>;

	const configTable = <table>
		<tbody>
			<tr>
				<td className="firstColumn">Barcode size</td>
				<td className="secondColumn">{sizeList}</td>
			</tr>
			<tr>
				<td className="firstColumn">Error correction</td>
				<td className="secondColumn">{ecLevelList}</td>
			</tr>
			<tr>
				<td className="firstColumn">Character encoding</td>
				<td className="secondColumn">{encodingList}</td>
			</tr>
		</tbody>
	</table>;

	const SelectedGenerator = generatorMap.get(selectedGeneratorKey)!;

	const topPanel = <table id="leftpanel">
		<tbody>
			<tr>
				<td>{selectionTable}</td>
			</tr>
			<tr>
				<td><SelectedGenerator /></td>
			</tr>
			<tr>
				<td><span id="errorMessageID" className="errorMessage"></span></td>
			</tr>
			<tr>
				<td>{configTable}</td>
			</tr>
			<tr>
				<td>{generateGrid}</td>
			</tr>
		</tbody>
	</table>;

	return topPanel;
}

export default LeftPanel;
