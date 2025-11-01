// client/src/classes/RootFindingMethod.js
import NumericalMethod from "./NumericalMethod";

/**
 * Base class for root finding methods
 */
class RootFindingMethod extends NumericalMethod {
  constructor(equation = "") {
    super();
    this.equation = equation;
  }

  /**
   * Set equation to solve
   * @param {string} equation - Mathematical equation
   */
  setEquation(equation) {
    if (!equation || equation.trim() === "") {
      throw new Error("Equation cannot be empty");
    }
    this.equation = equation;
  }

  /**
   * Get current equation
   * @returns {string} Current equation
   */
  getEquation() {
    return this.equation;
  }

  /**
   * Validate equation by testing with a sample value
   * @returns {boolean} True if equation is valid
   */
  validateEquation() {
    try {
      this.evaluateEquation(this.equation, 1);
      return true;
    } catch (error) {
      throw new Error("Invalid equation: " + error.message);
    }
  }

  /**
   * Calculate root (must be implemented by subclasses)
   * @throws {Error} If not implemented
   */
  calculate() {
    throw new Error("calculate() must be implemented by subclass");
  }
}

export default RootFindingMethod;
