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

function LeftPanel() {
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
				<td className="secondColumn"><></></td>
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


	const topPanel = <table id="leftpanel">
		<tbody>
			<tr>
				<td>{selectionTable}</td>
			</tr>
			<tr>
				<td><></></td>
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
