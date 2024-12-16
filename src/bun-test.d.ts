declare module 'bun:test' {
	export function describe(description: string, fn: () => void): void;
	export function it(description: string, fn: () => void): void;
	export function expect<T>(actual: T): {
		toBe(expected: T): void;
		toMatchSnapshot(): void;
		// 必要に応じて他のマッチャーを追加
	};
}
