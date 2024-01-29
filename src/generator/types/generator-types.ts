export type GeneratorEvent = {
	onInvalid: (reason: string) => void;
	onSubmit: (rawText: string) => void;
};

export type GeneratorRef = {
	submit(): void;
	focus(): void;
};
