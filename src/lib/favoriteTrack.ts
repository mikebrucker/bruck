export function makeTrackId(number: number, disc?: number): string {
  return `${number}:${disc ?? 0}`;
}

export function parseTrackId(trackId: string): { number: number; disc: number } {
  const [number, disc] = trackId.split(":").map(Number);
  return { number, disc };
}
