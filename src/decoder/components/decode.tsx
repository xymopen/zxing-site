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

function Decode() {
	return <Layout {...{
		slots: {
			header: <><img src={zxingicon} id="icon" alt="" /> ZXing Decoder Online</>
		}
	}}>
		<Helmet>
			<meta name="description" content="Online barcode decoder from the ZXing project" />
			<title>ZXing Decoder Online</title>
		</Helmet>

		<p>Decode a 1D or 2D barcode from an image on the web. Supported formats include:</p>
		<table>
			<tbody>
				<tr>
					<td>
						<ul>
							<li>UPC-A and UPC-E</li>
							<li>EAN-8 and EAN-13</li>
							<li>Code 39</li>
						</ul>
					</td>
					<td>
						<ul>
							<li>Code 93</li>
							<li>Code 128</li>
							<li>ITF</li>
						</ul>
					</td>
					<td>
						<ul>
							<li>Codabar</li>
							<li>RSS-14 (all variants)</li>
							<li>RSS Expanded (most variants)</li>
							<li>QR Code</li>
						</ul>
					</td>
					<td>
						<ul>
							<li>Data Matrix</li>
							<li>Aztec</li>
							<li>PDF 417</li>
							<li><del>MaxiCode</del></li>
						</ul>
					</td>
				</tr>
			</tbody>
		</table>

		<form action="./decoderesult.html" method="get">
			<table className="upload">
				<tbody>
					<tr>
						<td style={{ textAlign: "right" }}>
							Enter an <label htmlFor="u">image URL</label>:
						</td>
						<td>
							<input type="text" size={80} name="u" id="u" />
						</td>
						<td>
							<input type="submit" />
						</td>
					</tr>
				</tbody>
			</table>
		</form>
		<form action="./decoderesult.html" method="post" encType="multipart/form-data">
			<table className="upload">
				<tbody>
					<tr>
						<td style={{ textAlign: "right" }}>
							Or <label htmlFor="f">upload a file</label> (&lt;10MB, &lt;10MP):
						</td>
						<td>
							<input type="file" name="f" id="f" />
						</td>
						<td>
							<input type="submit" />
						</td>
					</tr>
				</tbody>
			</table>
		</form>

		<p style={{ fontStyle: "italic" }}>Copyright 2008 and onwards ZXing authors</p>
	</Layout>;
}

export default Decode;
