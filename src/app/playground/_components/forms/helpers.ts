export function transformOptionalNumber(value: string) {
  if (value === '') {
    return undefined
  }
  return Number(value)
}
