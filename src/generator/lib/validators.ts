export const filterNumber = (number: string): string => number.replace(/[ .,\-()]/g, "");

export const validateNumber = (number: string): string | true => {
	if (!(/^\+?[0-9]+$/).test(number)) {
		return "Phone number must be digits only.";
	}
	return true;
};

export const validateUrl = (url: string): string | true => {
	if (!isBasicallyValidURI(url)) {
		return "URL is not valid.";
	}
	return true;
};

const isBasicallyValidURI = (uri: string): boolean => {
	if (uri === null || uri.includes(" ") || uri.includes("\n")) {
		return false;
	}
	const period = uri.indexOf(".");
	// Look for period in a domain but followed by at least a two-char TLD
	return period < uri.length - 2 && (period >= 0 || uri.includes(":"));
};

export const validateEmail = (email: string): string | true => {
	//FIXME: we can have a better check for email here.
	if (!(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/).test(email)) {
		return "Email is not valid.";
	}
	return true;
};
