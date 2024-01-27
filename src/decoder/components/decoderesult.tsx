/*
 * Copyright 2008 ZXing authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import zxingicon from "../../zxingicon.png";
import { Helmet } from "react-helmet";
import Layout from "./layout";
import "./decoderesult.css";
import { BarcodeFormat, Result } from "@zxing/library";

const BYTES_PER_LINE = 16;
const HALF_BYTES_PER_LINE = BYTES_PER_LINE / 2;

const arrayToString = (bytes: Uint8Array): string => {
	let result = "";

	for (let i = 0; i < bytes.length; i += 1) {
		result += bytes[i].toString(16).padStart(2, "0");
		if ((i + 1) % BYTES_PER_LINE == 0) {
			result += "\n";
		} else if ((i + 1) % HALF_BYTES_PER_LINE == 0) {
			result += "   ";
		} else {
			result += " ";
		}
	}

	return result;
};

function DecodeResult(props: {
	results: Result[]
}) {
	return <Layout {...{
		slots: {
			header: <><img src={zxingicon} id="icon" alt="" /> Decode Succeeded</>
		}
	}}>
		<Helmet>
			<meta name="robots" content="none" />
			<title>Decode Succeeded</title>
		</Helmet>

		{props.results.map(result => {
			const text = result.getText() ?? "(Not applicable)";
			const rawBytes = result.getRawBytes();
			const rawBytesString = rawBytes != null ? arrayToString(rawBytes) : "(Not applicable)";
			// TODO: const parsedResult = ResultParser.parseResult(result);
			// TODO: const displayResult = ResultParser.parseResult(result).getDisplayResult() ?? "(Not applicable)";

			return <table className="result">
				<tbody>
					<tr>
						<td>Raw text</td>
						<td>
							<pre>{text}</pre>
						</td>
					</tr>
					<tr>
						<td>Raw bytes</td>
						<td>
							<pre>{rawBytesString}</pre>
						</td>
					</tr>
					<tr>
						<td>Barcode format</td>
						<td>
							{BarcodeFormat[result.getBarcodeFormat()]}
						</td>
					</tr>
					{/* <tr>
						<td>Parsed Result Type</td>
						<td>
							{parsedResult.getType()}
						</td>
					</tr>
					<tr>
						<td>Parsed Result</td>
						<td>
							<pre>{displayResult}</pre>
						</td>
					</tr> */}
				</tbody>
			</table>;
		})}

	</Layout>;
}

export default DecodeResult;
