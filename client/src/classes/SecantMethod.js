// client/src/classes/SecantMethod.js
import RootFindingMethod from "./RootFindingMethod";

/**
 * Secant Method for finding roots
 */
class SecantMethod extends RootFindingMethod {
  constructor(equation = "") {
    super(equation);
    this.x0 = 0;
    this.x1 = 0;
  }

  /**
   * Set initial values
   * @param {number} x0 - First initial guess
   * @param {number} x1 - Second initial guess
   */
  setInitialValues(x0, x1) {
    if (x0 === x1) {
      throw new Error("X0 and X1 must be different");
    }
    this.x0 = x0;
    this.x1 = x1;
  }

  /**
   * Calculate root using Secant method
   * @returns {Object} Results object with data and result
   */
  calculate() {
    this.clearData();

    let x0 = this.x0;
    let x1 = this.x1;
    let x2, fX0, fX1;
    let ea = 100;
    let iter = 0;

    while (ea > this.tolerance && iter < this.maxIterations) {
      fX0 = this.evaluateEquation(this.equation, x0);
      fX1 = this.evaluateEquation(this.equation, x1);

      // Check for division by zero
      if (Math.abs(fX1 - fX0) < 1e-10) {
        throw new Error("Division by zero. f(X1) - f(X0) is too small.");
      }

      // Secant formula
      x2 = x1 - (fX1 * (x1 - x0)) / (fX1 - fX0);

      iter++;
      ea = this.calculateError(x1, x2);

      this.data.push({
        iteration: iter,
        X0: x0,
        X1: x1,
        X2: x2,
        fX0: fX0,
        fX1: fX1,
        error: ea,
      });

      x0 = x1;
      x1 = x2;
    }

    this.result = x2;
    return this.getResults();
  }

  /**
   * Get chart data for visualization
   * @returns {Object} Object with x and y values for chart
   */
  getChartData() {
    return {
      xValues: this.data.map((item, index) => index + 1),
      yValues: this.data.map((item) => item.X2),
      iterations: this.data.map((item) => item.iteration),
    };
  }
}

export default SecantMethod;
