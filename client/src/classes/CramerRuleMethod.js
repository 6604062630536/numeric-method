// client/src/classes/CramerRuleMethod.js
import LinearAlgebraMethod from "./LinearAlgebraMethod";

/**
 * Cramer's Rule Method for solving systems of linear equations
 */
class CramerRuleMethod extends LinearAlgebraMethod {
  constructor() {
    super();
    this.solution = {};
    this.determinants = [];
    this.mainDeterminant = 0;
  }

  /**
   * Calculate determinant of a matrix recursively
   * @param {Array<Array<number>>} mat - Matrix to calculate determinant
   * @returns {number} Determinant value
   */
  calculateDeterminant(mat) {
    const size = mat.length;

    // Base case: 1x1 matrix
    if (size === 1) {
      return mat[0][0];
    }

    // Base case: 2x2 matrix
    if (size === 2) {
      return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
    }

    // Recursive case: nxn matrix (n > 2)
    let det = 0;
    for (let col = 0; col < size; col++) {
      // Create sub-matrix by removing first row and current column
      const subMatrix = [];
      for (let i = 1; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
          if (j !== col) {
            row.push(mat[i][j]);
          }
        }
        subMatrix.push(row);
      }

      // Calculate cofactor and add to determinant
      const cofactor = (col % 2 === 0 ? 1 : -1) * mat[0][col];
      det += cofactor * this.calculateDeterminant(subMatrix);
    }

    return det;
  }

  /**
   * Create matrix with replaced column for Cramer's rule
   * @param {number} colIndex - Column to replace with constants
   * @returns {Array<Array<number>>} New matrix
   */
  createReplacedMatrix(colIndex) {
    const newMatrix = this.matrix.map((row) => [...row]);

    for (let i = 0; i < this.matrixSize; i++) {
      newMatrix[i][colIndex] = this.constants[i];
    }

    return newMatrix;
  }

  /**
   * Calculate solution using Cramer's Rule
   * @returns {Object} Solution object with results
   */
  calculate() {
    this.clearData();
    this.validate();

    // Calculate main determinant (D)
    this.mainDeterminant = this.calculateDeterminant(this.matrix);

    // Check if system has unique solution
    if (Math.abs(this.mainDeterminant) < 1e-10) {
      throw new Error("No unique solution exists (determinant is zero)");
    }

    // Calculate determinants for each variable
    this.determinants = [];
    this.solution = {};

    for (let i = 0; i < this.matrixSize; i++) {
      // Create matrix with i-th column replaced by constants
      const replacedMatrix = this.createReplacedMatrix(i);

      // Calculate determinant
      const det = this.calculateDeterminant(replacedMatrix);
      this.determinants.push(det);

      // Calculate variable value using Cramer's rule: xi = Di / D
      const variableValue = det / this.mainDeterminant;
      this.solution[`x${i + 1}`] = variableValue;

      // Store in data array for display
      this.data.push({
        variable: `x${i + 1}`,
        determinant: det,
        value: variableValue,
      });
    }

    this.result = this.solution;
    return this.getResults();
  }

  /**
   * Get solution as array
   * @returns {Array<number>} Solution values
   */
  getSolutionArray() {
    const solutionArray = [];
    for (let i = 1; i <= this.matrixSize; i++) {
      solutionArray.push(this.solution[`x${i}`]);
    }
    return solutionArray;
  }

  /**
   * Get main determinant
   * @returns {number} Main determinant value
   */
  getMainDeterminant() {
    return this.mainDeterminant;
  }

  /**
   * Get all determinants
   * @returns {Array<number>} Array of determinants
   */
  getDeterminants() {
    return this.determinants;
  }

  /**
   * Verify solution by substituting back into equations
   * @returns {boolean} True if solution is correct
   */
  verifySolution() {
    const epsilon = 1e-6;
    const solutionArray = this.getSolutionArray();

    for (let i = 0; i < this.matrixSize; i++) {
      let sum = 0;
      for (let j = 0; j < this.matrixSize; j++) {
        sum += this.matrix[i][j] * solutionArray[j];
      }

      if (Math.abs(sum - this.constants[i]) > epsilon) {
        return false;
      }
    }

    return true;
  }
}

export default CramerRuleMethod;
