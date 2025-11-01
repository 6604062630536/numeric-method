// client/src/classes/InterpolationMethod.js
import NumericalMethod from "./NumericalMethod";

/**
 * Base class for Interpolation methods
 */
class InterpolationMethod extends NumericalMethod {
  constructor() {
    super();
    this.points = [];
    this.xValue = 0;
    this.numberOfPoints = 0;
  }

  /**
   * Set data points for interpolation
   * @param {Array<{x: number, y: number}>} points - Array of data points
   */
  setPoints(points) {
    if (!Array.isArray(points) || points.length === 0) {
      throw new Error("Points must be a non-empty array");
    }

    // Validate points structure
    for (let i = 0; i < points.length; i++) {
      if (
        typeof points[i].x === "undefined" ||
        typeof points[i].y === "undefined"
      ) {
        throw new Error(`Point at index ${i} must have 'x' and 'y' properties`);
      }
      if (isNaN(points[i].x) || isNaN(points[i].y)) {
        throw new Error(`Point at index ${i} has invalid numeric values`);
      }
    }

    // Check for duplicate x values
    const xValues = points.map((p) => p.x);
    const uniqueX = new Set(xValues);
    if (uniqueX.size !== xValues.length) {
      throw new Error("Duplicate x values are not allowed");
    }

    // Sort points by x value
    this.points = points
      .map((p) => ({ x: Number(p.x), y: Number(p.y) }))
      .sort((a, b) => a.x - b.x);

    this.numberOfPoints = this.points.length;
  }

  /**
   * Set x value to interpolate
   * @param {number} xValue - X value for interpolation
   */
  setXValue(xValue) {
    if (isNaN(xValue)) {
      throw new Error("X value must be a number");
    }
    this.xValue = Number(xValue);
  }

  /**
   * Get x values array
   * @returns {Array<number>} Array of x values
   */
  getXValues() {
    return this.points.map((p) => p.x);
  }

  /**
   * Get y values array
   * @returns {Array<number>} Array of y values
   */
  getYValues() {
    return this.points.map((p) => p.y);
  }

  /**
   * Get number of data points
   * @returns {number} Number of points
   */
  getNumberOfPoints() {
    return this.numberOfPoints;
  }

  /**
   * Get point at index
   * @param {number} index - Point index
   * @returns {{x: number, y: number}} Point at index
   */
  getPoint(index) {
    if (index < 0 || index >= this.numberOfPoints) {
      throw new Error("Point index out of bounds");
    }
    return { ...this.points[index] };
  }

  /**
   * Add a new point
   * @param {number} x - X value
   * @param {number} y - Y value
   */
  addPoint(x, y) {
    if (isNaN(x) || isNaN(y)) {
      throw new Error("X and Y must be numbers");
    }

    // Check if x already exists
    if (this.points.some((p) => p.x === x)) {
      throw new Error("X value already exists");
    }

    this.points.push({ x: Number(x), y: Number(y) });
    this.points.sort((a, b) => a.x - b.x);
    this.numberOfPoints = this.points.length;
  }

  /**
   * Remove point at index
   * @param {number} index - Point index to remove
   */
  removePoint(index) {
    if (index < 0 || index >= this.numberOfPoints) {
      throw new Error("Point index out of bounds");
    }

    this.points.splice(index, 1);
    this.numberOfPoints = this.points.length;
  }

  /**
   * Check if x value is within interpolation range
   * @returns {boolean} True if within range
   */
  isWithinRange() {
    if (this.numberOfPoints < 2) {
      return false;
    }

    const minX = this.points[0].x;
    const maxX = this.points[this.numberOfPoints - 1].x;

    return this.xValue >= minX && this.xValue <= maxX;
  }

  /**
   * Print points for debugging
   * @returns {string} Formatted points string
   */
  printPoints() {
    let output = "Data Points:\n";
    this.points.forEach((point, index) => {
      output += `Point ${index + 1}: (${point.x}, ${point.y})\n`;
    });
    output += `\nInterpolation at x = ${this.xValue}`;
    return output;
  }

  /**
   * Validate interpolation setup
   * @returns {boolean} True if valid
   */
  validate() {
    if (this.numberOfPoints === 0) {
      throw new Error("No data points provided");
    }
    if (this.numberOfPoints < 2) {
      throw new Error("At least 2 data points are required");
    }
    return true;
  }

  /**
   * Calculate interpolation (must be implemented by subclasses)
   * @throws {Error} If not implemented
   */
  calculate() {
    throw new Error("calculate() must be implemented by subclass");
  }
}

export default InterpolationMethod;
