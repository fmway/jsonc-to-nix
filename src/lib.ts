import { parse as jsoncParse } from "@std/jsonc";

export const jsonc = {
	parse(val: string) {
		return jsoncParse(val);
	},

	safeParse(val: string) {
		try {
			return this.parse(val);
		} catch (e) {
			return null;
		}
	}
};

export function jsonToNix(
	json: unknown,
	level: number = 1,
): string | undefined {
	const indent = '  '.repeat(level);
	const subindent = '  '.repeat(level - 1);
	if (
		typeof json === 'string' ||
		typeof json === 'boolean' ||
		Number.isFinite(json) ||
		json === null
	)
		return `${JSON.stringify(json)}`;
	else if (json === undefined)
		return `${JSON.stringify(null)}`;
	else if (Array.isArray(json))
		return `[\n${json.map((item) => `${indent}${jsonToNix(item, level + 1)}`).join('\n')}\n${subindent}]`;
	else {
		let nix = '{\n';
		for (const [key, value] of Object.entries(
			json as Record<string, boolean | string | null>,
		)) {
			nix += `${indent}${key.includes(' ') || key.includes('$') || /^[0-9]/.test(key) ? `"${key}"` : key} = ${jsonToNix(value, level + 1)};\n`;
		}
		return nix?.trimEnd() + `\n${subindent}}`;
	}
}
