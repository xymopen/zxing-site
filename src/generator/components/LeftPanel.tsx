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

import { useCallback, useEffect, useRef, useState } from "react";
import ContactInfoGenerator from "./ContactInfoGenerator";
import EmailGenerator from "./EmailGenerator";
import GeoLocationGenerator from "./GeoLocationGenerator";
import PhoneNumberGenerator from "./PhoneNumberGenerator";
import SmsAddressGenerator from "./SmsAddressGenerator";
import TextGenerator from "./TextGenerator";
import UrlGenerator from "./UrlGenerator";
import WifiGenerator from "./WifiGenerator";
import { GeneratorRef } from "../types/generator-types";

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

function LeftPanel(props: {
	setBarcode: (url: string, text: string) => void;
	invalidateBarcode: () => void;
}) {
	const [selectedGeneratorKey, setSelectedGeneratorKey] = useState(() => generators[0].key as GeneratorKey);
	const focusRequest = useRef(true);
	const selectedGeneratorRef = useRef<GeneratorRef>(null);
	const [errorMessage, setErrorMessage] = useState("");

	const setErrorMessageAndInvalidateBarcode = useCallback((value: string) => {
		setErrorMessage(value);
		props.invalidateBarcode();
	}, [
		setErrorMessage,
		props.invalidateBarcode
	]);

	const generate = useCallback(() => {
		selectedGeneratorRef.current?.submit();
	},[selectedGeneratorRef]);

	const setSelectedGeneratorKeyAndFocus: React.ChangeEventHandler<HTMLSelectElement> = useCallback(event => {
		// updates the second row of the table with the content of the selected generator
		setSelectedGeneratorKey(event.target.value as GeneratorKey);
		setErrorMessage("");
		props.invalidateBarcode();
		focusRequest.current = true;
	}, [
		setSelectedGeneratorKey,
		setErrorMessage,
		props.invalidateBarcode
	]);

	useEffect(() => {
		if (focusRequest.current && selectedGeneratorRef.current != null) {
			selectedGeneratorRef.current.focus();
			focusRequest.current = false;
		}
	}, [selectedGeneratorRef.current]);

	// fills up the list of generators
	const genList = <select
		className="gwt-ListBox"
		value={selectedGeneratorKey}
		onChange={setSelectedGeneratorKeyAndFocus}
	>
		{generators.map((generator) => {
			const widget = <option key={generator.key} value={generator.key}>{generator.key}</option>;
			return widget;
		})}
	</select>;

	type SizeType = 120 | 230 | 350;
	const [size, setSize] = useState<SizeType>(350);
	const sizeList = <select
		className="gwt-ListBox"
		value={size}
		onChange={useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
			event => setSize(Number(event.target.value) as SizeType),
			[setSize]
		)}
	>
		<option value={120}>Small</option>
		<option value={230}>Medium</option>
		<option value={350}>Large</option>
	</select>;

	type EcLevelType = "L" | "M" | "Q" | "H";
	const [ecLevel, setEcLevel] = useState<EcLevelType>("L");
	const ecLevelList = <select
		className="gwt-ListBox"
		value={ecLevel}
		onChange={useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
			event => setEcLevel(event.target.value as EcLevelType),
			[setEcLevel]
		)}
	>
		<option value="L">L</option>
		<option value="M">M</option>
		<option value="Q">Q</option>
		<option value="H">H</option>
	</select>;

	type EncodingType = "UTF-8" | "ISO-8859-1" | "Shift_JIS";
	const [encoding, setEncoding] = useState<EncodingType>("UTF-8");
	const encodingList = <select
		className="gwt-ListBox"
		value={encoding}
		onChange={useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
			event => setEncoding(event.target.value as EncodingType),
			[setEncoding]
		)}
	>
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

	const setRawText = useCallback((text: string) => {
		setErrorMessage("");
		// const url = getUrl(size, size, ecLevel, encoding, text);
		// props.setBarcode(url, text);
	}, [
		size,
		size,
		ecLevel,
		encoding,
		props.invalidateBarcode,
		props.setBarcode
	]);

	// grid for the generate button
	const generateGrid = <table>
		<tbody>
			<tr>
				<td className="firstColumn" />
				<td className="secondColumn">
					<button className="gwt-Button" onClick={generate}>Generate &rarr;</button>
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
				<td><SelectedGenerator ref={selectedGeneratorRef} onInvalid={setErrorMessageAndInvalidateBarcode} onSubmit={setRawText} /></td>
			</tr>
			<tr>
				<td><span id="errorMessageID" className="errorMessage">{errorMessage}</span></td>
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
