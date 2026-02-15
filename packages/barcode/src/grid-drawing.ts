/**
 * Custom bwip-js drawing backend that records filled pixels into a boolean[][]
 * grid. This avoids any canvas/image dependency and is synchronous.
 */
export class GridDrawing {
  private _grid: boolean[][] = [];
  private _width = 0;
  private _height = 0;
  private _polys: number[][][] = [];

  setopts(_opts: Record<string, unknown>) {}

  scale(sx: number, sy: number): [number, number] {
    return [sx, sy];
  }

  measure(
    _str: string,
    _font: string,
    _fwidth: number,
    _fheight: number,
  ): { width: number; ascent: number; descent: number } {
    return { width: 0, ascent: 0, descent: 0 };
  }

  init(width: number, height: number) {
    this._width = Math.ceil(width);
    this._height = Math.ceil(height);
    this._grid = Array.from({ length: this._height }, () =>
      new Array<boolean>(this._width).fill(false),
    );
  }

  /**
   * Draw a thick orthogonal line (used by 1D barcodes).
   * Coordinates represent the line center; linew is the full thickness.
   */
  line(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    linew: number,
    _rgb: string,
  ) {
    const half = linew / 2;
    const w = Math.round(linew);
    let minX: number, maxX: number, minY: number, maxY: number;

    if (Math.abs(y0 - y1) < 0.1) {
      // Horizontal line
      minX = Math.round(Math.min(x0, x1));
      maxX = Math.round(Math.max(x0, x1));
      minY = Math.round(y0 - half);
      maxY = minY + w - 1;
    } else {
      // Vertical line
      minX = Math.round(x0 - half);
      maxX = minX + w - 1;
      minY = Math.round(Math.min(y0, y1));
      maxY = Math.round(Math.max(y0, y1));
    }

    minX = Math.max(0, minX);
    minY = Math.max(0, minY);
    maxX = Math.min(this._width - 1, maxX);
    maxY = Math.min(this._height - 1, maxY);

    for (let r = minY; r <= maxY; r++)
      for (let c = minX; c <= maxX; c++) this._grid[r][c] = true;
  }

  polygon(pts: number[][]) {
    this._polys.push(pts);
  }

  hexagon(_pts: number[][], _rgb: string) {}
  ellipse(_x: number, _y: number, _rx: number, _ry: number, _ccw: boolean) {}

  /**
   * Fill all accumulated polygons using scanline with non-zero winding rule.
   * Polygons from bwip-js are always orthogonal (axis-aligned edges).
   */
  fill(_rgb: string) {
    // Collect all vertical edges from all polygons
    const edges: { x: number; yMin: number; yMax: number; dir: number }[] = [];

    for (const poly of this._polys) {
      const n = poly.length;
      for (let i = 0; i < n; i++) {
        const [x0, y0] = poly[i];
        const [x1, y1] = poly[(i + 1) % n];
        // Only vertical edges contribute to horizontal scanline crossings
        if (Math.abs(x0 - x1) < 0.001) {
          const yMin = Math.min(y0, y1);
          const yMax = Math.max(y0, y1);
          if (yMax - yMin > 0.001) {
            edges.push({ x: x0, yMin, yMax, dir: y1 > y0 ? 1 : -1 });
          }
        }
      }
    }

    for (let row = 0; row < this._height; row++) {
      const scanY = row + 0.5;

      // Find vertical edges that cross this scanline
      const crossings: { x: number; dir: number }[] = [];
      for (const edge of edges) {
        if (edge.yMin < scanY && scanY < edge.yMax) {
          crossings.push({ x: edge.x, dir: edge.dir });
        }
      }

      if (crossings.length === 0) continue;
      crossings.sort((a, b) => a.x - b.x);

      // Walk pixels left to right, tracking winding number
      let winding = 0;
      let ci = 0;
      for (let col = 0; col < this._width; col++) {
        while (ci < crossings.length && crossings[ci].x <= col) {
          winding += crossings[ci].dir;
          ci++;
        }
        if (winding !== 0) {
          this._grid[row][col] = true;
        }
      }
    }

    this._polys = [];
  }

  clip(_polys: number[][][]) {}
  unclip() {}
  text(
    _x: number,
    _y: number,
    _str: string,
    _rgb: string,
    _font: unknown,
  ) {}

  end(): boolean[][] {
    return this._grid;
  }
}
