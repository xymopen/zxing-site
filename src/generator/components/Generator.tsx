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

import LeftPanel from "./LeftPanel";

function Generator() {
	const topPanel = <LeftPanel />;

	const div = <div id="imageresult">
		<div id="innerresult">
			<img className="gwt-Image" />
		</div>
	</div>;

	const urlResult = <input id="urlresult" className="gwt-TextBox" type="text" />;
	const rawTextResult = <textarea id="rawtextresult" className="gwt-TextArea" cols={50} rows={8} />;
	const downloadText = <div id="downloadText" className="gwt-HTML"><a href="" id="downloadlink" >Download</a> or embed with this URL:</div>;
	const rightPanel = <table>
		<tbody>
			<tr><td align="left" style={{ verticalAlign: "top" }}>{div}</td></tr>
			<tr><td align="left" style={{ verticalAlign: "top" }}>{downloadText}</td></tr>
			<tr><td align="left" style={{ verticalAlign: "top" }}>{urlResult}</td></tr>
			<tr><td align="left" style={{ verticalAlign: "top" }}>{rawTextResult}</td></tr>
		</tbody>
	</table>;

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
