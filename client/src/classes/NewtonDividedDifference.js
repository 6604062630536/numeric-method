// client/src/classes/NewtonDividedDifference.js
import InterpolationMethod from "./InterpolationMethod";

/**
 * Newton's Divided Difference Interpolation Method
 */
class NewtonDividedDifference extends InterpolationMethod {
  constructor() {
    super();
    this.dividedDifferenceTable = [];
    this.coefficients = [];
  }

  /**
   * Calculate divided difference table
   * @returns {Array<Array<number>>} Divided difference table
   */
  calculateDividedDifferenceTable() {
    const n = this.numberOfPoints;
    const x = this.getXValues();
    const y = this.getYValues();

    // Initialize table
    const table = Array.from({ length: n }, () => Array(n).fill(0));

    // First column is y values
    for (let i = 0; i < n; i++) {
      table[i][0] = y[i];
    }

    // Calculate divided differences
    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        table[i][j] =
          (table[i + 1][j - 1] - table[i][j - 1]) / (x[i + j] - x[i]);
      }
    }

    return table;
  }

  /**
   * Get coefficients from divided difference table
   * @param {Array<Array<number>>} table - Divided difference table
   * @returns {Array<number>} Coefficients array
   */
  extractCoefficients(table) {
    const coefficients = [];
    for (let i = 0; i < this.numberOfPoints; i++) {
      coefficients.push(table[0][i]);
    }
    return coefficients;
  }

  /**
   * Calculate interpolated value using Newton's divided difference formula
   * @returns {number} Interpolated value
   */
  interpolate() {
    const x = this.getXValues();
    const n = this.numberOfPoints;

    // Start with first coefficient (c0)
    let result = this.coefficients[0];

    // Calculate each term
    let term = 1;
    for (let i = 1; i < n; i++) {
      term *= this.xValue - x[i - 1];
      result += this.coefficients[i] * term;
    }

    return result;
  }

  /**
   * Calculate interpolation using Newton's Divided Difference method
   * @returns {Object} Results object with data and result
   */
  calculate() {
    this.clearData();
    this.validate();

    // Calculate divided difference table
    this.dividedDifferenceTable = this.calculateDividedDifferenceTable();

    // Extract coefficients from first row
    this.coefficients = this.extractCoefficients(this.dividedDifferenceTable);

    // Store table data for display
    const x = this.getXValues();
    for (let i = 0; i < this.numberOfPoints; i++) {
      const rowData = {
        x: x[i],
        coefficients: [],
      };

      for (let j = 0; j < this.numberOfPoints - i; j++) {
        rowData.coefficients.push(this.dividedDifferenceTable[i][j]);
      }

      this.data.push(rowData);
    }

    // Calculate interpolated value
    this.result = this.interpolate();

    return this.getResults();
  }

  /**
   * Get divided difference table
   * @returns {Array<Array<number>>} Divided difference table
   */
  getDividedDifferenceTable() {
    return this.dividedDifferenceTable;
  }

  /**
   * Get coefficients
   * @returns {Array<number>} Coefficients array
   */
  getCoefficients() {
    return this.coefficients;
  }

  /**
   * Get Newton polynomial as string
   * @returns {string} Polynomial representation
   */
  getPolynomialString() {
    const x = this.getXValues();
    let polynomial = `P(x) = ${this.coefficients[0].toFixed(4)}`;

    for (let i = 1; i < this.numberOfPoints; i++) {
      let term = ` + ${this.coefficients[i].toFixed(4)}`;

      for (let j = 0; j < i; j++) {
        term += `(x - ${x[j]})`;
      }

      polynomial += term;
    }

    return polynomial;
  }

  /**
   * Get formatted table for display
   * @returns {Array<Object>} Formatted table data
   */
  getFormattedTable() {
    const x = this.getXValues();
    const formattedTable = [];

    for (let i = 0; i < this.numberOfPoints; i++) {
      const row = {
        x: x[i],
        c0: this.dividedDifferenceTable[i][0],
      };

      for (let j = 1; j < this.numberOfPoints - i; j++) {
        row[`c${j}`] = this.dividedDifferenceTable[i][j];
      }

      formattedTable.push(row);
    }

    return formattedTable;
  }

  /**
   * Verify result by comparing with actual y values at known points
   * @returns {boolean} True if interpolation passes through all points
   */
  verifyResult() {
    const epsilon = 1e-6;

    for (let i = 0; i < this.numberOfPoints; i++) {
      const point = this.getPoint(i);

      // Temporarily set xValue to point's x
      const originalX = this.xValue;
      this.xValue = point.x;

      // Calculate interpolated value
      const interpolatedY = this.interpolate();

      // Restore original xValue
      this.xValue = originalX;

      // Check if interpolated value matches actual y value
      if (Math.abs(interpolatedY - point.y) > epsilon) {
        return false;
      }
    }

    return true;
  }
}

export default NewtonDividedDifference;
