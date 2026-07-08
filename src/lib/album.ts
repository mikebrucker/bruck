export const parseRuntimeSeconds = (runtime: string): number => {
  const parts = runtime.split(":").map(Number);
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  const [minutes, seconds] = parts;
  return minutes * 60 + seconds;
};

export const formatRuntimeSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  return `${minutes}:${String(remainderSeconds).padStart(2, "0")}`;
};
