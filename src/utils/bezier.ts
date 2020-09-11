interface Bezier {
  (aX: number): number;
  getControlPoints(): [
    {
      x: number;
      y: number;
    },
    {
      x: number;
      y: number;
    }
  ];
  toString(): string;
}

// heavy load
export function generateCubicBezier(mX1: number, mY1: number, mX2: number, mY2: number): Bezier;
export function generateCubicBezier(mX1, mY1, mX2, mY2) {
  const NEWTON_ITERATIONS = 4;
  const NEWTON_MIN_SLOPE = 0.001;
  const SUBDIVISION_PRECISION = 0.0000001;
  const SUBDIVISION_MAX_ITERATIONS = 10;
  const kSplineTableSize = 11;
  const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
  const float32ArraySupported = typeof Float32Array !== "undefined";

  /* Must contain four arguments. */
  if (arguments.length !== 4) {
    return false;
  }

  /* Arguments must be numbers. */
  for (let i = 0; i < 4; i += 1) {
    // eslint-disable-next-line prefer-rest-params, no-restricted-globals
    if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
      return false;
    }
  }

  /* X values must be in the [0, 1] range. */
  /* eslint-disable no-param-reassign */
  mX1 = Math.min(mX1, 1);
  mX2 = Math.min(mX2, 1);
  mX1 = Math.max(mX1, 0);
  mX2 = Math.max(mX2, 0);
  /* eslint-enable no-param-reassign */

  const mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

  function A(aA1, aA2) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1;
  }

  function B(aA1, aA2) {
    return 3.0 * aA2 - 6.0 * aA1;
  }

  function C(aA1) {
    return 3.0 * aA1;
  }

  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }

  function getSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function newtonRaphsonIterate(aX, aGuessT) {
    for (let i = 0; i < NEWTON_ITERATIONS; i += 1) {
      const currentSlope = getSlope(aGuessT, mX1, mX2);

      if (currentSlope === 0.0) {
        return aGuessT;
      }

      const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      // eslint-disable-next-line no-param-reassign
      aGuessT -= currentX / currentSlope;
    } /*  */

    return aGuessT;
  }

  function calcSampleValues() {
    for (let i = 0; i < kSplineTableSize; i += 1) {
      mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
  }

  function binarySubdivide(aX, aA, aB) {
    let currentX;
    let currentT;
    let i = 0;

    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) {
        // eslint-disable-next-line no-param-reassign
        aB = currentT;
      } else {
        // eslint-disable-next-line no-param-reassign
        aA = currentT;
      }
      // eslint-disable-next-line no-plusplus
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

    return currentT;
  }

  function getTForX(aX) {
    let intervalStart = 0.0;
    let currentSample = 1;
    const lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; currentSample += 1) {
      intervalStart += kSampleStepSize;
    }

    currentSample -= 1;

    const dist =
      (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]);
    const guessForT = intervalStart + dist * kSampleStepSize;
    const initialSlope = getSlope(guessForT, mX1, mX2);

    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT);
    }
    if (initialSlope === 0.0) {
      return guessForT;
    }
    return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
  }

  // eslint-disable-next-line no-underscore-dangle
  let _precomputed = false;

  function precompute() {
    _precomputed = true;
    if (mX1 !== mY1 || mX2 !== mY2) {
      calcSampleValues();
    }
  }

  const f: Bezier = function (aX) {
    if (!_precomputed) {
      precompute();
    }
    if (mX1 === mY1 && mX2 === mY2) {
      return aX;
    }
    if (aX === 0) {
      return 0;
    }
    if (aX === 1) {
      return 1;
    }

    return calcBezier(getTForX(aX), mY1, mY2);
  };

  f.getControlPoints = function () {
    return [
      {
        x: mX1,
        y: mY1,
      },
      {
        x: mX2,
        y: mY2,
      },
    ];
  };

  const str = `generateBezier(${[mX1, mY1, mX2, mY2]})`;
  f.toString = function () {
    return str;
  };

  return f;
}

interface BezierFun {
  (start: number, end: number, percent: number): number;
}

interface CubicBezier {
  (t1: number, p1: number, t2: number, p2: number): BezierFun;
}
export const cubicBezier: CubicBezier = function (t1, p1, t2, p2) {
  const bezier = generateCubicBezier(t1, p1, t2, p2);

  const a: BezierFun = function (start, end, percent) {
    return start + (end - start) * bezier(percent);
  };
  return a;
};

export const easings = {
  linear(start, end, percent) {
    return start + (end - start) * percent;
  },

  // default easings
  ease: cubicBezier(0.25, 0.1, 0.25, 1),
  "ease-in": cubicBezier(0.42, 0, 1, 1),
  "ease-out": cubicBezier(0, 0, 0.58, 1),
  "ease-in-out": cubicBezier(0.42, 0, 0.58, 1),

  // sine
  "ease-in-sine": cubicBezier(0.47, 0, 0.745, 0.715),
  "ease-out-sine": cubicBezier(0.39, 0.575, 0.565, 1),
  "ease-in-out-sine": cubicBezier(0.445, 0.05, 0.55, 0.95),

  // quad
  "ease-in-quad": cubicBezier(0.55, 0.085, 0.68, 0.53),
  "ease-out-quad": cubicBezier(0.25, 0.46, 0.45, 0.94),
  "ease-in-out-quad": cubicBezier(0.455, 0.03, 0.515, 0.955),

  // cubic
  "ease-in-cubic": cubicBezier(0.55, 0.055, 0.675, 0.19),
  "ease-out-cubic": cubicBezier(0.215, 0.61, 0.355, 1),
  "ease-in-out-cubic": cubicBezier(0.645, 0.045, 0.355, 1),

  // quart
  "ease-in-quart": cubicBezier(0.895, 0.03, 0.685, 0.22),
  "ease-out-quart": cubicBezier(0.165, 0.84, 0.44, 1),
  "ease-in-out-quart": cubicBezier(0.77, 0, 0.175, 1),

  // quint
  "ease-in-quint": cubicBezier(0.755, 0.05, 0.855, 0.06),
  "ease-out-quint": cubicBezier(0.23, 1, 0.32, 1),
  "ease-in-out-quint": cubicBezier(0.86, 0, 0.07, 1),

  // expo
  "ease-in-expo": cubicBezier(0.95, 0.05, 0.795, 0.035),
  "ease-out-expo": cubicBezier(0.19, 1, 0.22, 1),
  "ease-in-out-expo": cubicBezier(1, 0, 0, 1),

  // circ
  "ease-in-circ": cubicBezier(0.6, 0.04, 0.98, 0.335),
  "ease-out-circ": cubicBezier(0.075, 0.82, 0.165, 1),
  "ease-in-out-circ": cubicBezier(0.785, 0.135, 0.15, 0.86),

  // user param easings...

  "cubic-bezier": cubicBezier,
};
