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

import { KeyboardEvent, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { GeneratorEvent, GeneratorRef } from "../types/generator-types";
import forwardAnyRef, { SetRef } from "../hook/forward-any-ref";
import { filterNumber, validateEmail, validateNumber, validateUrl } from "../lib/validators";

function getMeCard(
	name: string,
	company: string,
	title: string,
	tel: string,
	url: string,
	email: string,
	address: string,
	address2: string,
	memo: string
): string {
	let output = "MECARD:";
	output += maybeAppendMECARD("N", name.replace(/,/g, ""));
	output += maybeAppendMECARD("ORG", company);
	output += maybeAppendMECARD("TEL", tel.replace(/[^0-9+]+/g, ""));
	output += maybeAppendMECARD("URL", url);
	output += maybeAppendMECARD("EMAIL", email);
	output += maybeAppendMECARD("ADR", buildAddress(address, address2));
	let memoContents = "";
	if (memo != "") {
		memoContents += memo;
	}
	if (title != "") {
		if (memoContents.length > 0) {
			memoContents += "\n";
		}
		memoContents += title;
	}
	output += maybeAppendMECARD("NOTE", memoContents);
	output += ";";
	return output;
}

function buildAddress(address: string, address2: string): string {
	if (address !== "") {
		if (address2 !== "") {
			return address + " " + address2;
		}
		return address;
	}
	if (address2 !== "") {
		return address2;
	}
	return "";
}

function maybeAppendMECARD(prefix: string, value: string): string {
	if (value !== "") {
		value = value.replace(/([:\\;])/g, "\\$1");
		value = value.replace(/\n/g, "");
		return prefix + ":" + value + ";";
	}
	return "";
}

function getVCard(
	name: string,
	company: string,
	title: string,
	tel: string,
	url: string,
	email: string,
	address: string,
	address2: string,
	memo: string
): string {
	let output = "BEGIN:VCARD\n";
	output += "VERSION:3.0\n";
	output += maybeAppendvCard("N", name);
	output += maybeAppendvCard("ORG", company);
	output += maybeAppendvCard("TITLE", title);
	output += maybeAppendvCard("TEL", tel);
	output += maybeAppendvCard("URL", url);
	output += maybeAppendvCard("EMAIL", email);
	output += maybeAppendvCard("ADR", buildAddress(address, address2));
	output += maybeAppendvCard("NOTE", memo);
	output += "END:VCARD";
	return output;
}

function maybeAppendvCard(prefix: string, value: string): string {
	if (value !== "") {
		value = value.replace(/([,;])/g, "\\$1");
		value = value.replace(/\n/g, "\\n");
		return prefix + ":" + value + "\n";
	}
	return "";
}

const ContactInfoGenerator = forwardAnyRef((props: GeneratorEvent, setRef: SetRef<GeneratorRef>) => {
	const focusTargetRef = useRef<HTMLInputElement>(null);
	const focusRequested = useRef(false);

	type Encoding = "MECARD" | "vCard";
	const [encoding, setEncoding] = useState<Encoding>("MECARD");
	const [name, setName] = useState("");
	const [company, setCompany] = useState("");
	const [title, setTitle] = useState("");
	const [tel, setTel] = useState("");
	const [url, setUrl] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
	const [address2, setAddress2] = useState("");
	const [memo, setMemo] = useState("");

	const innerValidateName = useCallback(() => {
		{
			if (name.length === 0) {
				props.onInvalid("Name must be at least 1 character.");
				return false;
			}
		}

		return true;
	}, [
		name,
		props.onInvalid
	]);

	const innerValidateTel = useCallback(() => {
		const input = filterNumber(tel);

		{
			const reason = validateNumber(input);

			if (reason !== true) {
				props.onInvalid(reason);
				return false;
			}
		}

		{
			if (input.includes(";")) {
				props.onInvalid("Tel must not contains ; characters");
				return false;
			}
		}

		return true;
	}, [
		tel,
		props.onInvalid
	]);

	const innerValidateUrl = useCallback(() => {
		{
			if (url.length != 0) {
				const reason = validateUrl(url);

				if (reason !== true) {
					props.onInvalid(reason);
					return false;
				}
			}
		}

		return true;
	}, [
		url,
		props.onInvalid
	]);

	const innerValidateEmail = useCallback(() => {
		if (email.length != 0) {
			{
				const reason = validateEmail(email);

				if (reason !== true) {
					props.onInvalid(reason);
					return false;
				}
			}

			{
				if (email.includes(";")) {
					props.onInvalid("Email must not contains ; characters");
					return false;
				}
			}
		}

		return true;
	}, [
		email,
		props.onInvalid
	]);

	const submit = useCallback(() => {
		if (
			innerValidateName() &&
			innerValidateTel() &&
			innerValidateUrl() &&
			innerValidateEmail()
		) {

			if (encoding === "vCard") {
				props.onSubmit(getVCard(name, company, title, tel, url, email, address, address2, memo));
			} else {
				props.onSubmit(getMeCard(name, company, title, tel, url, email, address, address2, memo));
			}
		}
	}, [
		encoding,
		name,
		company,
		title,
		tel,
		url,
		email,
		address,
		address2,
		memo,
		innerValidateName,
		innerValidateTel,
		innerValidateUrl,
		innerValidateEmail,
		props.onSubmit
	]);

	const keyPressHandler = useCallback((event: KeyboardEvent) => {
		if (event.charCode == ("\n").charCodeAt(0) || event.charCode == ("\r").charCodeAt(0)) {
			submit();
		}
	}, [submit]);

	useEffect(() => {
		setRef({
			submit,
			focus() {
				focusRequested.current = true;
			}
		});
	}, [submit,
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
					Name
				</td>
				<td className="secondColumn">
					<input
						ref={focusTargetRef}
						className="gwt-TextBox required"
						type="text"
						value={name}
						onChange={event => setName(event.target.value)}
						onBlur={innerValidateName}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Company
				</td>
				<td className="secondColumn">
					<input
						className="gwt-TextBox"
						type="text"
						value={company}
						onChange={event => setCompany(event.target.value)}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Title
				</td>
				<td className="secondColumn">
					<input
						className="gwt-TextBox"
						type="text"
						value={title}
						onChange={event => setTitle(event.target.value)}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Phone number
				</td>
				<td className="secondColumn">
					<input
						className="gwt-TextBox"
						type="text"
						value={tel}
						onChange={event => setTel(event.target.value)}
						onBlur={innerValidateTel}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Email
				</td>
				<td className="secondColumn">
					<input
						className="gwt-TextBox"
						type="text"
						value={email}
						onChange={event => setEmail(event.target.value)}
						onBlur={innerValidateEmail}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Address
				</td>
				<td className="secondColumn">
					<input
						className="gwt-TextBox"
						type="text"
						value={address}
						onChange={event => setAddress(event.target.value)}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Address 2
				</td>
				<td className="secondColumn">
					<input
						className="gwt-TextBox"
						type="text"
						value={address2}
						onChange={event => setAddress2(event.target.value)}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Website
				</td>
				<td className="secondColumn">
					<input
						className="gwt-TextBox"
						type="text"
						value={url}
						onChange={event => setUrl(event.target.value)}
						onBlur={innerValidateUrl}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Memo
				</td>
				<td className="secondColumn">
					<input
						className="gwt-TextBox"
						type="text"
						value={memo}
						onChange={event => setMemo(event.target.value)}
						onKeyPress={keyPressHandler}
					/>
				</td>
			</tr>
			<tr>
				<td className="firstColumn">
					Encoding
				</td>
				<td className="secondColumn">
					<select
						className="gwt-ListBox"
						value={encoding}
						onChange={event => setEncoding(event.target.value as Encoding)}
					>
						<option value="MECARD">MECARD</option>
						<option value="vCard">vCard</option>
					</select>
				</td>
			</tr>
		</tbody>
	</table>;
});

const key = "Contact information" as const;

Object.defineProperty(ContactInfoGenerator, "key", {
	configurable: true,
	enumerable: true,
	value: key,
	writable: false
});

export default ContactInfoGenerator as typeof ContactInfoGenerator & { readonly key: typeof key };
