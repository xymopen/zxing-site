import { ForwardedRef } from "react";

const setForwardRef = <T>(ref: ForwardedRef<T>, current: T | null) => {
	if (typeof ref == "function") {
		ref(current);
	} else if (ref != null && typeof ref === "object") {
		ref.current = current;
	}
};

export default setForwardRef;
