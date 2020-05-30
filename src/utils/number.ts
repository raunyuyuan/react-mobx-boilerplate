export const isNumber = (v: string | number): 'string' | 'number' | false => {
  const typeResult = typeof v
  if (typeResult === 'number') return typeResult
  if (typeResult === 'string') {
    if ((v as string).trim() === '') return false
    return isNaN(Number(v)) ? false : typeResult
  }
  return false
}


export const thousandsCount = (v: any): typeof v | string => {
  const numType = isNumber(v)
  if (!numType) {
    console.error('param forward to thousandsCount is not a number')
    return v
  }
  if (numType === 'number') v = String(v)
  const pointIdx = v.indexOf('.')
  const isNegative = v.startsWith('-')
  const hasPoint = pointIdx !== -1
  let integer = v.substring(isNegative ? 1 : 0, hasPoint ? pointIdx - 1 : v.length)
  let integerLen = integer.length
  const arr = []
  while (integerLen > 3) {
    arr.unshift(integer.substring(integerLen - 3, integerLen))
    integerLen -= 3
  }
  if (integerLen > 0) arr.unshift(integer.substring(0, integerLen))
  const thousandses = arr.join()
  if (isNegative && hasPoint) return `-${thousandses}${v.substring(pointIdx)}`
  if (isNegative) return `-${thousandses}`
  if (hasPoint) return `${thousandses}${v.substring(pointIdx)}`
  return thousandses
}
