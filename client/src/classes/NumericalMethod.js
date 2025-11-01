// client/src/classes/NumericalMethod.js
import { evaluate } from "mathjs";

/**
 * Base class for all numerical methods
 */
class NumericalMethod {
  constructor() {
    this.data = [];
    this.result = null;
    this.maxIterations = 50;
    this.tolerance = 0.00001;
  }

  /**
   * Calculate error percentage between two values
   * @param {number} xOld - Old value
   * @param {number} xNew - New value
   * @returns {number} Error percentage
   */
  calculateError(xOld, xNew) {
    return Math.abs((xNew - xOld) / xNew) * 100;
  }

  /**
   * Evaluate mathematical equation
   * @param {string} equation - Mathematical equation
   * @param {number} value - X value to evaluate
   * @returns {number} Result of evaluation
   */
  evaluateEquation(equation, value) {
    try {
      return evaluate(equation, { x: value });
    } catch (error) {
      console.error("Equation evaluation error:", error);
      throw new Error("Invalid equation format");
    }
  }

  /**
   * Clear previous calculation data
   */
  clearData() {
    this.data = [];
    this.result = null;
  }

  /**
   * Get calculation results
   * @returns {Object} Object containing data and result
   */
  getResults() {
    return {
      data: this.data,
      result: this.result,
    };
  }

  /**
   * Set maximum iterations
   * @param {number} max - Maximum iterations
   */
  setMaxIterations(max) {
    this.maxIterations = max;
  }

  /**
   * Set tolerance for convergence
   * @param {number} tol - Tolerance value
   */
  setTolerance(tol) {
    this.tolerance = tol;
  }
}

export default NumericalMethod;
