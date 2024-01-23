import { ReactNode } from "react";

type PropsWithSlots<S, P = unknown> = P & { slots?: { [P in keyof S]: S[P] extends never ? never : ReactNode } };

export default PropsWithSlots;
