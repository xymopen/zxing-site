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

function DecodeResult() {
	return <Layout {...{
		slots: {
			header: <><img src={zxingicon} id="icon" alt="" /> Decode Succeeded</>
		}
	}}>
		<Helmet>
			<meta name="robots" content="none" />
			<title>Decode Succeeded</title>
		</Helmet>

		<table id="result">
			<tr>
				<td>Raw text</td>
				<td>
					<pre>{"${text}"}</pre>
				</td>
			</tr>
			<tr>
				<td>Raw bytes</td>
				<td>
					<pre>{"${rawBytesString}"}</pre>
				</td>
			</tr>
			<tr>
				<td>Barcode format</td>
				<td>
					{"${result.barcodeFormat}"}
				</td>
			</tr>
			<tr>
				<td>Parsed Result Type</td>
				<td>
					{"${parsedResult.type}"}
				</td>
			</tr>
			<tr>
				<td>Parsed Result</td>
				<td>
					<pre>{"${displayResult}"}</pre>
				</td>
			</tr>
		</table>
	</Layout>;
}

export default DecodeResult;
