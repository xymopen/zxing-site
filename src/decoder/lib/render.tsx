import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("main")!);

const render = (children: ReactNode): void => {
	root.render(<StrictMode>{children}</StrictMode >);
};

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		root.unmount();
	});
}

export default render;
