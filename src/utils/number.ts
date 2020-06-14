export const isNumber = (v: string | number): typeof v | false => {
  const typeResult = typeof v
  if (typeResult === 'number') return typeResult
  if (typeResult === 'string') {
    if ((v as string).trim() === '') return false
    return isNaN(Number(v)) ? false : typeResult
  }
  return false
}


export const thousandsCount = (v: number | string): typeof v | string => {
  const numType = isNumber(v)
  if (!numType) {
    console.error('param forward to thousandsCount is not a number')
    return v
  }
  if (numType === 'number') v = String(v)
  const pointIdx = (v as string).indexOf('.')
  const isNegative = (v as string).startsWith('-')
  const hasPoint = pointIdx !== -1
  let integer = (v as string).substring(isNegative ? 1 : 0, hasPoint ? pointIdx - 1 : (v as string).length)
  let integerLen = integer.length
  const arr = []
  while (integerLen > 3) {
    arr.unshift(integer.substring(integerLen - 3, integerLen))
    integerLen -= 3
  }
  if (integerLen > 0) arr.unshift(integer.substring(0, integerLen))
  const thousandses = arr.join()
  if (isNegative && hasPoint) return `-${thousandses}${(v as string).substring(pointIdx)}`
  if (isNegative) return `-${thousandses}`
  if (hasPoint) return `${thousandses}${(v as string).substring(pointIdx)}`
  return thousandses
}


/**
 * @param  {string | number} v the wait format value
 * @param {number | string} a
 * @return {string} return a number with a string type that keep {a} decimals and rounded
 */
export const toFixed = (v: string | number, a: number | string): typeof v | string => {
  const numType = isNumber(v)
  const anumType = isNumber(a)
  if (!anumType) {
    console.error('param forward to toFixed is not a numebr')
    return v
  }
  if (!numType) {
    console.error('param forward to toFixed is not a numebr')
    return v
  }
  let formatV = v
  if (numType === 'number') formatV = String(v)
  if (anumType === 'string') a = Number(a)
  const pointIdx = (formatV as string).indexOf('.')
  const hasPoint = pointIdx !== -1
  if (hasPoint) {
    const recordDecimal = (formatV as string).substring(pointIdx + 1, pointIdx + Number(a) + 1);
    const len = recordDecimal.length
    const fullDecimalLen = ((formatV as string).length - pointIdx)
    if (fullDecimalLen <= a) {
      for (let i = len; i < a; i++) {
        formatV += '0'
      }
      return formatV
    }
    let afteraNum: number = Number((formatV as String)[pointIdx + (a as number) + 1])
    if (a > 0) {
      if (afteraNum >= 5) {
        return `${(formatV as string).substring(0, pointIdx)}.${Number(recordDecimal) + 1}` 
      }
      return `${(formatV as string).substring(0, pointIdx)}.${recordDecimal}`
    }
    if (a === 0) {
      return String(Number((formatV as string).substring(0, pointIdx)) + (afteraNum >= 5 ? 1 : 0))
    }
    
  } else if (a !== 0) {
    let i = 0;
    formatV += '.'
    while(i < a) {
      formatV += '0'
      i++
    }
  }
  return formatV
}
