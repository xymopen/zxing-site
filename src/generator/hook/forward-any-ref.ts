import { forwardRef, ForwardedRef, ForwardRefExoticComponent, ForwardRefRenderFunction, PropsWithoutRef, RefAttributes, ReactNode } from "react";
import setForwardRef from "../lib/set-forward-ref";

export type SetRef<T> = (current: T | null) => void;

type ForwardAnyRefRenderFunction<T, P> = ((props: P, setRef: SetRef<T>) => ReactNode) & { [P in keyof ForwardRefRenderFunction<T, P>]: ForwardRefRenderFunction<T, P>[P] };

// eslint-disable-next-line @typescript-eslint/ban-types
function forwardAnyRef<T, P = {}>(render: ForwardAnyRefRenderFunction<T, P>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
	const wrapper: ForwardRefRenderFunction<T, P> = function (props: P, ref: ForwardedRef<T>) {
		return render(props, current => setForwardRef(ref, current));
	};

	Object.assign(
		wrapper,
		Object.fromEntries(
			Object.entries(Object.getOwnPropertyDescriptors(render))
				.filter(([_, descriptor]) => descriptor.writable != false)
		)
	);

	return forwardRef(wrapper);
}

export default forwardAnyRef;
