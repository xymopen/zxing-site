import { PropsWithChildren } from "react";
import PropsWithSlots from "../../types/props-with-slots";

function Layout(props: PropsWithChildren & PropsWithSlots<{
	header?: true
}>) {
	return <>
		{props.slots?.header && <div id="header">
			<h1>
				{props.slots.header}
			</h1>
		</div>}
		{props.children}
	</>;
}

export default Layout;
