// client/src/classes/BisectionMethod.js
import RootFindingMethod from "./RootFindingMethod";

/**
 * Bisection Method for finding roots
 */
class BisectionMethod extends RootFindingMethod {
  constructor(equation = "") {
    super(equation);
    this.xl = 0;
    this.xr = 0;
  }

  /**
   * Set initial boundary values
   * @param {number} xl - Left boundary
   * @param {number} xr - Right boundary
   */
  setInitialValues(xl, xr) {
    if (xl >= xr) {
      throw new Error("XL must be less than XR");
    }
    this.xl = xl;
    this.xr = xr;
  }

  /**
   * Validate initial values
   * @returns {boolean} True if valid
   */
  validateInitialValues() {
    const fXl = this.evaluateEquation(this.equation, this.xl);
    const fXr = this.evaluateEquation(this.equation, this.xr);

    if (fXl * fXr > 0) {
      throw new Error("f(XL) and f(XR) must have opposite signs");
    }
    return true;
  }

  /**
   * Calculate root using Bisection method
   * @returns {Object} Results object with data and result
   */
  calculate() {
    this.clearData();
    this.validateInitialValues();

    let xl = this.xl;
    let xr = this.xr;
    let xm, fXm, fXr;
    let ea = 100;
    let iter = 0;

    while (ea > this.tolerance && iter < this.maxIterations) {
      xm = (xl + xr) / 2.0;
      fXr = this.evaluateEquation(this.equation, xr);
      fXm = this.evaluateEquation(this.equation, xm);

      iter++;

      if (fXm * fXr > 0) {
        ea = this.calculateError(xr, xm);
        this.data.push({
          iteration: iter,
          Xl: xl,
          Xm: xm,
          Xr: xr,
          fXm: fXm,
          error: ea,
        });
        xr = xm;
      } else if (fXm * fXr < 0) {
        ea = this.calculateError(xl, xm);
        this.data.push({
          iteration: iter,
          Xl: xl,
          Xm: xm,
          Xr: xr,
          fXm: fXm,
          error: ea,
        });
        xl = xm;
      } else {
        // Found exact root
        break;
      }
    }

    this.result = xm;
    return this.getResults();
  }

  /**
   * Get chart data for visualization
   * @returns {Object} Object with x and y values for chart
   */
  getChartData() {
    return {
      xValues: this.data.map((item) => item.Xm),
      yValues: this.data.map((item) => item.fXm),
      iterations: this.data.map((item) => item.iteration),
    };
  }
}

export default BisectionMethod;
