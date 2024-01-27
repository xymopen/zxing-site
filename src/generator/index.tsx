import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainPanel from "./components/Generator";

const root = createRoot(document.getElementById("ui")!);
root.render(<StrictMode><MainPanel /></StrictMode >);

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		root.unmount();
	});
}
