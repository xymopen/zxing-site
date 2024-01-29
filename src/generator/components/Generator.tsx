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

import { useCallback, useState } from "react";
import LeftPanel from "./LeftPanel";

function Generator() {
	const [result, setResult] = useState("");

	const [resultVisible, setResultVisible] = useState(false);
	const div = <div id="imageresult">
		<div id="innerresult">
			<img
				className="gwt-Image"
				src={result}
				style={resultVisible ? {} : { display: "none" }}
			/>
		</div>
	</div>;

	const [urlResultVisible, setUrlResultVisible] = useState(false);
	const urlResult = <input
		id="urlresult"
		className="gwt-TextBox"
		type="text"
		readOnly={true}
		value={result}
		style={urlResultVisible ? {} : { display: "none" }}
	/>;

	const [rawTextResultText, setRawTextResultText] = useState("");
	const [rawTextResultVisible, setRawTextResultVisible] = useState(false);
	const rawTextResult = <textarea
		id="rawtextresult"
		className="gwt-TextArea"
		readOnly={true}
		cols={50}
		rows={8}
		value={rawTextResultText}
		style={rawTextResultVisible ? {} : { display: "none" }}
	/>;

	const [downloadTextVisible, setDownloadTextVisible] = useState(false);
	const downloadText = <div id="downloadText" className="gwt-HTML" style={downloadTextVisible ? {} : { display: "none" }}>
		<a href={result} id="downloadlink" >Download</a> or embed with this URL:
	</div>;
	const rightPanel = <table>
		<tbody>
			<tr><td align="left" style={{ verticalAlign: "top" }}>{div}</td></tr>
			<tr><td align="left" style={{ verticalAlign: "top" }}>{downloadText}</td></tr>
			<tr><td align="left" style={{ verticalAlign: "top" }}>{urlResult}</td></tr>
			<tr><td align="left" style={{ verticalAlign: "top" }}>{rawTextResult}</td></tr>
		</tbody>
	</table>;

	const setBarcode = useCallback((url: string, text: string) => {
		setResult(url);
		setResultVisible(true);
		setUrlResultVisible(true);
		setRawTextResultText(text);
		setRawTextResultVisible(true);
		setDownloadTextVisible(true);
	}, [
		setResult,
		setResultVisible,
		setUrlResultVisible,
		setRawTextResultText,
		setRawTextResultVisible,
		setDownloadTextVisible
	]);

	const invalidateBarcode = useCallback(() => {
		setResult("");
		setResultVisible(false);
		setUrlResultVisible(false);
		setRawTextResultText("");
		setRawTextResultVisible(false);
		setDownloadTextVisible(false);
	}, [
		setResult,
		setResultVisible,
		setUrlResultVisible,
		setRawTextResultText,
		setRawTextResultVisible,
		setDownloadTextVisible
	]);

	const topPanel = <LeftPanel setBarcode={setBarcode} invalidateBarcode={invalidateBarcode} />;

	return <table id="mainpanel" cellSpacing={0} cellPadding={0}>
		<tbody>
			<tr>
				<td align="left" style={{ verticalAlign: "top" }}>{topPanel}</td>
				<td align="left" style={{ verticalAlign: "top" }}>{rightPanel}</td>
			</tr>
		</tbody>
	</table>;
}

export default Generator;
