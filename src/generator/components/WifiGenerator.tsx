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

import { KeyboardEvent, Ref, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { GeneratorEvent, GeneratorRef } from "../types/generator-types";

const validTextField = (input: string, name: string): string | true => {
	if (input.includes("\n")) {
		return `${name} field must not contain \\n characters.`;
	}
	return true;
};

const parseTextField = (input: string): string => input.replace(/([\\:;])/g, (_, $1: string) => $1);

const WifiGenerator = forwardRef((props: GeneratorEvent, ref: Ref<GeneratorRef>) => {
	const focusTargetRef = useRef<HTMLInputElement>(null);
	const focusRequested = useRef(false);

	type NetworkType = "WEP" | "WPA" | "nopass";
	const [ssid, setSsid] = useState("");
	const [password, setPassword] = useState("");
	const [networkType, setNetworkType] = useState<NetworkType>("WEP");
	const [hidden, setHidden] = useState(false);

	const innerValidateSsid = useCallback(() => {
		{
			if (ssid.length === 0) {
				props.onInvalid("SSID must be at least 1 character.");
				return false;
			}
		}

		{
			const reason = validTextField(ssid, "SSID");

			if (reason !== true) {
				props.onInvalid(reason);
				return false;
			}
		}

		return true;
	}, [
		ssid,
		props.onInvalid
	]);

	const innerValidatePassword = useCallback(() => {
		const reason = validTextField(password, "Password");

		if (reason !== true) {
			props.onInvalid(reason);
			return false;
		}

		return true;
	}, [
		password,
		props.onInvalid
	]);

	const submit = useCallback(() => {
		if (innerValidateSsid() && innerValidatePassword()) {
			const parsedSsid = parseTextField(ssid);
			const parsedPassword = parseTextField(password);

			// Build the output with obtained data.
			let output = "WIFI:";
			output += `S:${parsedSsid};`;
			if (networkType !== "nopass") {
				output += `T:${networkType};`;
			}
			if (parsedPassword !== "") {
				output += `P:${parsedPassword};`;
			}
			if (hidden) {
				output += "H:true;";
			}
			output += ";";
			props.onSubmit(output);
		}
	}, [
		ssid,
		password,
		networkType,
		hidden,
		innerValidateSsid,
		innerValidatePassword,
		props.onSubmit
	]);

	const keyPressHandler = useCallback((event: KeyboardEvent) => {
		if (event.charCode == ("\n").charCodeAt(0) || event.charCode == ("\r").charCodeAt(0)) {
			submit();
		}
	}, [submit]);

	useImperativeHandle(ref, () =>
		({
			submit,
			focus() {
				focusRequested.current = true;
			}
		})
	, [submit,
		forwardRef]);

	useEffect(() => {
		if (focusRequested.current && focusTargetRef.current != null) {
			focusTargetRef.current.focus();
			focusRequested.current = false;
		}
	}, [focusTargetRef]);

	return <table>
		<tbody>
			<tr>
				<td className="firstColumn">
					SSID
				</td>
				<td className="secondColumn">
					<input
						ref={focusTargetRef}
						className="gwt-TextBox required"
						type="text"
						value={ssid}
						onChange={event => setSsid(event.target.value)}
						onBlur={innerValidateSsid}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Password
				</td>
				<td className="secondColumn">
					<input
						className="gwt-TextBox"
						type="text"
						value={password}
						onChange={event => setPassword(event.target.value)}
						onBlur={innerValidatePassword}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Network Type
				</td>
				<td className="secondColumn">
					<select
						className="gwt-ListBox"
						value={networkType}
						onChange={event => setNetworkType(event.target.value as NetworkType)}
					>
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
					<input
						className="gwt-CheckBox"
						type="checkbox"
						checked={hidden}
						onChange={event => setHidden(event.target.checked)}
					/>
				</td>
			</tr>
		</tbody>
	</table>;
});

const key = "Wifi network" as const;

Object.defineProperty(WifiGenerator, "key", {
	configurable: true,
	enumerable: true,
	value: key,
	writable: false
});

export default WifiGenerator as typeof WifiGenerator & { readonly key: typeof key };
