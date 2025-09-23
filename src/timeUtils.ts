export function permissiveDateToInputString(d: string | number): string {
  if (typeof d === "string") {
    return d;
  }
  const iso = new Date(d * 1000).toISOString();
  return iso.substring(0, iso.lastIndexOf(":"));
}
