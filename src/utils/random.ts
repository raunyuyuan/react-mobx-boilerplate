/**
 * @param {number} n number
 * @returns {number} a random integer uniformly between 0 (inclusive) and n (exclusive)
 */
export function uniform(n: number): number;
/**
 * @param {number} lo - number of lower bound
 * @param {number} hi - number must big then lo
 * @returns {number} a random integer uniformly between {@link lo } (inclusive) and {@link hi} (exclusive)
 */
export function uniform(lo: number, hi: number): number;
/**
 * @returns {number} a number in [0, 1)
 */
export function uniform(): number;
export function uniform(i?, j?) {
  if (i == null && j != null) throw new Error("When the second argument has a value, the first must has");
  if (i == null && j == null) return Math.random();
  if (j == null) return Math.floor(Math.random() * i);
  if (j <= i) throw new Error(`invalid range: [${i}, ${j})`);
  return i + Math.floor(Math.random() * (j - i));
}

/**
 * shuffle the array
 * @param {Array} a the array for shuffle
 * @returns {Array} a array has been shuffled
 */
export function shuffle<Item>(a: Item[]): Item[];
/**
 * shuffle the array
 * @param {Array} a the array for shuffle
 * @param {number} lo the lower bound
 * @param {number} hi the higher bound
 * @returns {Array} a array has been shuffled
 */
export function shuffle<Item>(a: Item[], lo: number, hi: number): Item[];
export function shuffle<Item>(a: Item[], lo?, hi?): Item[] {
  if (!Array.isArray(a)) throw new Error("Arguments must be array");
  const len = a.length;
  let start = 0;
  let end = len - 1;
  if (lo != null && hi != null) {
    if (lo < 0 || hi >= len || lo > hi) throw new Error(`subarray indices out of bounds: [${lo}, ${hi})`);
    start = lo;
    end = hi;
  }

  for (let i = start; i <= end; i += 1) {
    const n = uniform(i, len);
    const temp = a[i];
    // eslint-disable-next-line no-param-reassign
    a[i] = a[n];
    // eslint-disable-next-line no-param-reassign
    a[n] = temp;
  }
  return a;
}
