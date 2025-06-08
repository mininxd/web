import { easy, medium, hard } from "./filters.ts";

export function variant(input: string, variantMap: Record<string, string>): string[] {
  const parts: string[][] = [];
  let i = 0;

  while (i < input.length) {
    const match = input.slice(i).match(/^\(([a-zA-Z])\)/);
    if (match) {
      const base = match[1].toLowerCase();
      const variants = [...(variantMap[base] || base)];
      parts.push(variants);
      i += 3;
    } else {
      parts.push([input[i]]);
      i++;
    }
  }

  const combinations = cartesianProduct(parts);
  return combinations.map(chars => chars.join(""));
}

function cartesianProduct<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (acc, curr) => acc.flatMap(a => curr.map(b => [...a, b])),
    [[]]
  );
}


export function repeat(input: string, howMany: number): string {
  return input.replace(/\{([a-zA-Z]|\([a-zA-Z]\))\}/g, (_, char) => char.repeat(howMany));
}
