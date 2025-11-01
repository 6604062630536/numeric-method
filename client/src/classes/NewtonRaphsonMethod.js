// client/src/classes/NewtonRaphsonMethod.js
import RootFindingMethod from "./RootFindingMethod";

/**
 * Newton-Raphson Method for finding roots
 */
class NewtonRaphsonMethod extends RootFindingMethod {
  constructor(equation = "", derivative = "") {
    super(equation);
    this.derivative = derivative;
    this.x0 = 0;
  }

  /**
   * Set derivative equation
   * @param {string} derivative - Derivative equation
   */
  setDerivative(derivative) {
    if (!derivative || derivative.trim() === "") {
      throw new Error("Derivative cannot be empty");
    }
    this.derivative = derivative;
  }

  /**
   * Set initial value
   * @param {number} x0 - Initial guess
   */
  setInitialValue(x0) {
    this.x0 = x0;
  }

  /**
   * Calculate root using Newton-Raphson method
   * @returns {Object} Results object with data and result
   */
  calculate() {
    this.clearData();

    if (!this.derivative) {
      throw new Error("Derivative equation is required");
    }

    let x0 = this.x0;
    let x1, fX0, fXd, fXm;
    let ea = 100;
    let iter = 0;

    while (ea > this.tolerance && iter < this.maxIterations) {
      fX0 = this.evaluateEquation(this.equation, x0);
      fXd = this.evaluateEquation(this.derivative, x0);

      // Check for zero derivative
      if (Math.abs(fXd) < 1e-10) {
        throw new Error("Derivative is zero. Cannot continue iteration.");
      }

      // Newton-Raphson formula
      x1 = x0 - fX0 / fXd;
      fXm = this.evaluateEquation(this.equation, x1);

      iter++;
      ea = Math.abs((x1 - x0) / x1) * 100;

      this.data.push({
        iteration: iter,
        X0: x0,
        X1: x1,
        fX0: fX0,
        fXd: fXd,
        fXm: fXm,
        error: ea,
      });

      x0 = x1;

      // Check if converged
      if (Math.abs(fXm) < this.tolerance) {
        break;
      }
    }

    this.result = x0;
    return this.getResults();
  }

  /**
   * Get chart data for visualization
   * @returns {Object} Object with x and y values for chart
   */
  getChartData() {
    return {
      xValues: this.data.map((item, index) => index + 1),
      yValues: this.data.map((item) => item.fXm),
      iterations: this.data.map((item) => item.iteration),
    };
  }
}

export default NewtonRaphsonMethod;
