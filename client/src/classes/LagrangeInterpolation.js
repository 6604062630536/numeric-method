// client/src/classes/LagrangeInterpolation.js
import InterpolationMethod from "./InterpolationMethod";

/**
 * Lagrange Interpolation Method
 */
class LagrangeInterpolation extends InterpolationMethod {
  constructor() {
    super();
    this.lagrangeTerms = [];
    this.basisPolynomials = [];
  }

  /**
   * Calculate Lagrange basis polynomial L_i(x) for point i
   * @param {number} i - Index of the basis polynomial
   * @returns {number} Value of L_i(x) at this.xValue
   */
  calculateBasisPolynomial(i) {
    const x = this.getXValues();
    let Li = 1.0;

    for (let j = 0; j < this.numberOfPoints; j++) {
      if (i !== j) {
        Li *= (this.xValue - x[j]) / (x[i] - x[j]);
      }
    }

    return Li;
  }

  /**
   * Calculate all Lagrange basis polynomials
   * @returns {Array<number>} Array of basis polynomial values
   */
  calculateAllBasisPolynomials() {
    const basisPolynomials = [];

    for (let i = 0; i < this.numberOfPoints; i++) {
      const Li = this.calculateBasisPolynomial(i);
      basisPolynomials.push(Li);
    }

    return basisPolynomials;
  }

  /**
   * Calculate interpolated value using Lagrange formula
   * @returns {number} Interpolated value
   */
  interpolate() {
    const y = this.getYValues();
    let result = 0;

    for (let i = 0; i < this.numberOfPoints; i++) {
      result += y[i] * this.basisPolynomials[i];
    }

    return result;
  }

  /**
   * Calculate interpolation using Lagrange method
   * @returns {Object} Results object with data and result
   */
  calculate() {
    this.clearData();
    this.validate();

    // Calculate all basis polynomials
    this.basisPolynomials = this.calculateAllBasisPolynomials();

    // Store basis polynomial values and contributions
    const x = this.getXValues();
    const y = this.getYValues();

    for (let i = 0; i < this.numberOfPoints; i++) {
      const contribution = y[i] * this.basisPolynomials[i];

      this.data.push({
        index: i,
        x: x[i],
        y: y[i],
        Li: this.basisPolynomials[i],
        contribution: contribution,
      });
    }

    // Calculate final interpolated value
    this.result = this.interpolate();

    // Store lagrange terms for backward compatibility
    this.lagrangeTerms = this.basisPolynomials;

    return this.getResults();
  }

  /**
   * Get basis polynomial values
   * @returns {Array<number>} Array of L_i(x) values
   */
  getBasisPolynomials() {
    return this.basisPolynomials;
  }

  /**
   * Get Lagrange terms (alias for getBasisPolynomials)
   * @returns {Array<number>} Array of L_i(x) values
   */
  getLagrangeTerms() {
    return this.lagrangeTerms;
  }

  /**
   * Get contribution of each term to final result
   * @returns {Array<number>} Array of y_i * L_i(x) values
   */
  getContributions() {
    const y = this.getYValues();
    return this.basisPolynomials.map((Li, i) => y[i] * Li);
  }

  /**
   * Get Lagrange polynomial as string
   * @returns {string} Polynomial representation
   */
  getPolynomialString() {
    const x = this.getXValues();
    const y = this.getYValues();
    let polynomial = "P(x) = ";

    for (let i = 0; i < this.numberOfPoints; i++) {
      if (i > 0) polynomial += " + ";

      polynomial += `${y[i]} * L${i}(x)`;
    }

    polynomial += "\n\nwhere:\n";

    for (let i = 0; i < this.numberOfPoints; i++) {
      polynomial += `L${i}(x) = `;

      let terms = [];
      for (let j = 0; j < this.numberOfPoints; j++) {
        if (i !== j) {
          terms.push(`(x - ${x[j]}) / (${x[i]} - ${x[j]})`);
        }
      }

      polynomial += terms.join(" * ") + "\n";
    }

    return polynomial;
  }

  /**
   * Get formatted table data for display
   * @returns {Array<Object>} Formatted table data
   */
  getFormattedTable() {
    return this.data.map((item, index) => ({
      term: `L${index}`,
      value: item.Li,
      x: item.x,
      y: item.y,
      contribution: item.contribution,
    }));
  }

  /**
   * Calculate Lagrange polynomial derivative at x
   * @param {number} x - Point to evaluate derivative
   * @returns {number} Derivative value
   */
  calculateDerivative(x) {
    const xValues = this.getXValues();
    const yValues = this.getYValues();
    let derivative = 0;

    for (let i = 0; i < this.numberOfPoints; i++) {
      let dLi = 0;

      // Calculate derivative of L_i(x)
      for (let k = 0; k < this.numberOfPoints; k++) {
        if (k !== i) {
          let term = 1 / (xValues[i] - xValues[k]);

          for (let j = 0; j < this.numberOfPoints; j++) {
            if (j !== i && j !== k) {
              term *= (x - xValues[j]) / (xValues[i] - xValues[j]);
            }
          }

          dLi += term;
        }
      }

      derivative += yValues[i] * dLi;
    }

    return derivative;
  }

  /**
   * Verify result by checking if polynomial passes through all points
   * @returns {boolean} True if interpolation passes through all points
   */
  verifyResult() {
    const epsilon = 1e-6;

    for (let i = 0; i < this.numberOfPoints; i++) {
      const point = this.getPoint(i);

      // Temporarily set xValue to point's x
      const originalX = this.xValue;
      this.xValue = point.x;

      // Recalculate basis polynomials for this x
      this.basisPolynomials = this.calculateAllBasisPolynomials();

      // Calculate interpolated value
      const interpolatedY = this.interpolate();

      // Restore original xValue
      this.xValue = originalX;

      // Check if interpolated value matches actual y value
      if (Math.abs(interpolatedY - point.y) > epsilon) {
        return false;
      }
    }

    // Restore basis polynomials for original xValue
    this.basisPolynomials = this.calculateAllBasisPolynomials();

    return true;
  }
}

export default LagrangeInterpolation;
