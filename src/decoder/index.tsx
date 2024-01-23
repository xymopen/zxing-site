import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Decode from "./components/decode";

const root = createRoot(document.getElementById("main")!);
root.render(<StrictMode><Decode /></StrictMode>);

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		root.unmount();
	});
}
