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
import loadImageElement from "../../lib/load-image";
import download from "../../lib/download";

const getPngUrlFromSvg = async (svg: SVGSVGElement) => {
	const svgData = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
	const svgUrl = URL.createObjectURL(svgData);

	try {
		const img = await loadImageElement(svgUrl);
		const canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext("2d")!;
		ctx.drawImage(img, 0, 0);
		return canvas.toDataURL();
	} finally {
		URL.revokeObjectURL(svgUrl);
	}
};

function Generator() {
	const [svg, setSvg] = useState<SVGSVGElement | null>(null);

	const div = <div id="imageresult">
		<div id="innerresult" dangerouslySetInnerHTML={{ __html: svg?.outerHTML ?? "" }}>
		</div>
	</div>;

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

	const downloadQrcode = useCallback(async () => {
		if (svg != null) {
			download(await getPngUrlFromSvg(svg), "chart.png");
		}
	}, [svg]);

	const downloadQrcodeVoid = useCallback(() => void downloadQrcode(), [downloadQrcode]);

	const downloadText = <div id="downloadText" className="gwt-HTML" style={rawTextResultVisible ? {} : { display: "none" }}>
		<a href="javascript:void(0)" id="downloadlink" onClick={downloadQrcodeVoid}>Download</a>
	</div>;
	const rightPanel = <table>
		<tbody>
			<tr><td align="left" style={{ verticalAlign: "top" }}>{div}</td></tr>
			<tr><td align="left" style={{ verticalAlign: "top" }}>{downloadText}</td></tr>
			<tr><td align="left" style={{ verticalAlign: "top" }}>{rawTextResult}</td></tr>
		</tbody>
	</table>;

	const setBarcode = useCallback((svg: SVGSVGElement, text: string) => {
		setSvg(svg);
		setRawTextResultText(text);
		setRawTextResultVisible(true);
	}, [
		setSvg,
		setRawTextResultText,
		setRawTextResultVisible
	]);

	const invalidateBarcode = useCallback(() => {
		setSvg(null);
		setRawTextResultText("");
		setRawTextResultVisible(false);
	}, [
		setSvg,
		setRawTextResultText,
		setRawTextResultVisible
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
