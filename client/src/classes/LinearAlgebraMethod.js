// client/src/classes/LinearAlgebraMethod.js
import NumericalMethod from "./NumericalMethod";

/**
 * Base class for Linear Algebra methods
 */
class LinearAlgebraMethod extends NumericalMethod {
  constructor() {
    super();
    this.matrix = [];
    this.constants = [];
    this.matrixSize = 0;
  }

  /**
   * Set coefficient matrix
   * @param {Array<Array<number>>} matrix - Coefficient matrix
   */
  setMatrix(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0) {
      throw new Error("Matrix must be a non-empty array");
    }

    // Validate square matrix
    const size = matrix.length;
    for (let i = 0; i < size; i++) {
      if (!Array.isArray(matrix[i]) || matrix[i].length !== size) {
        throw new Error("Matrix must be square (n x n)");
      }
    }

    this.matrix = matrix.map((row) => [...row]); // Deep copy
    this.matrixSize = size;
  }

  /**
   * Set constants vector (right-hand side)
   * @param {Array<number>} constants - Constants vector
   */
  setConstants(constants) {
    if (!Array.isArray(constants) || constants.length === 0) {
      throw new Error("Constants must be a non-empty array");
    }

    if (this.matrixSize > 0 && constants.length !== this.matrixSize) {
      throw new Error(
        `Constants array length must match matrix size (${this.matrixSize})`
      );
    }

    this.constants = [...constants]; // Deep copy
  }

  /**
   * Get matrix size
   * @returns {number} Matrix size
   */
  getMatrixSize() {
    return this.matrixSize;
  }

  /**
   * Get matrix element
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {number} Matrix element
   */
  getMatrixElement(row, col) {
    if (
      row < 0 ||
      row >= this.matrixSize ||
      col < 0 ||
      col >= this.matrixSize
    ) {
      throw new Error("Matrix index out of bounds");
    }
    return this.matrix[row][col];
  }

  /**
   * Get constant element
   * @param {number} index - Index
   * @returns {number} Constant value
   */
  getConstant(index) {
    if (index < 0 || index >= this.constants.length) {
      throw new Error("Constants index out of bounds");
    }
    return this.constants[index];
  }

  /**
   * Print matrix for debugging
   * @returns {string} Formatted matrix string
   */
  printMatrix() {
    let output = "Matrix:\n";
    for (let i = 0; i < this.matrixSize; i++) {
      output += "[";
      for (let j = 0; j < this.matrixSize; j++) {
        output += this.matrix[i][j].toFixed(4);
        if (j < this.matrixSize - 1) output += ", ";
      }
      output += `] = ${this.constants[i]}\n`;
    }
    return output;
  }

  /**
   * Validate matrix and constants
   * @returns {boolean} True if valid
   */
  validate() {
    if (this.matrixSize === 0) {
      throw new Error("Matrix is not set");
    }
    if (this.constants.length !== this.matrixSize) {
      throw new Error("Constants length does not match matrix size");
    }
    return true;
  }

  /**
   * Calculate method (must be implemented by subclasses)
   * @throws {Error} If not implemented
   */
  calculate() {
    throw new Error("calculate() must be implemented by subclass");
  }
}

export default LinearAlgebraMethod;
