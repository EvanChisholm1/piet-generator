function getCanvas(id: string): {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
} {
  const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");
  if (!canvas) {
    throw new Error("canvas not found");
  }

  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("no canvas ctx");
  }

  return {
    canvas,
    ctx,
  };
}

const { canvas, ctx } = getCanvas("canvas");

class Grid {
  width: number;
  height: number;

  private grid: {
    [key: string]: string;
  } = {};

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  set(x: number, y: number, value: string) {
    this.grid[`${x} ${y}`] = value;
  }

  get(x: number, y: number) {
    return this.grid[`${x} ${y}`] || "white";
  }
}

const grid = new Grid(500, 500);

function addLines(grid: Grid) {
  const numberOfVertLines = 5;
  const numberOfHoriLines = 5;

  const vertLines: number[] = [];
  const horiLines: number[] = [];

  for (let i = 0; i < numberOfVertLines; i++) {
    const startingPoint = Math.round(Math.random() * grid.width);
    console.log(startingPoint);
    vertLines.push(startingPoint);
    addVertLine(grid, startingPoint, "black");
  }

  for (let i = 0; i < numberOfHoriLines; i++) {
    const startingPoint = Math.round(Math.random() * grid.width);
    console.log(startingPoint);
    horiLines.push(startingPoint);
    addHoriLine(grid, startingPoint, "black");
  }

  return {
    vertLines,
    horiLines,
  };
}

function addVertLine(grid: Grid, x: number, value: string) {
  console.log("addinga vertical line");
  for (let i = 0; i < grid.height; i++) {
    grid.set(x, i, value);
  }
}
function addHoriLine(grid: Grid, y: number, value: string) {
  console.log("addinga horizontal line");
  for (let i = 0; i < grid.height; i++) {
    grid.set(i, y, value);
  }
}

function renderGrid(grid: Grid, ctx: CanvasRenderingContext2D) {
  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      ctx.fillStyle = grid.get(x, y);
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function removeSegment(
  grid: Grid,
  startingPoint: number,
  direction: "vertical" | "horizontal"
) {
  const intersections: Array<{ x: number; y: number }> = [];

  intersections.push({ x: startingPoint, y: 0 });

  for (let i = 0; i < grid.height; i++) {
    const upOne = grid.get(startingPoint, i - 1);
    const downOne = grid.get(startingPoint, i + 1);
    const leftOne = grid.get(startingPoint - 1, i);
    const rightOne = grid.get(startingPoint + 1, i);

    const allAreLines = [upOne, downOne, leftOne, rightOne].every(
      point => point === "black"
    );
    if (allAreLines) {
      intersections.push({ x: startingPoint, y: i });
    }
  }

  intersections.push({ x: startingPoint, y: grid.height });

  const pointA = Math.floor(Math.random() * (intersections.length - 2));
  const pointB = pointA + 1;

  for (let i = intersections[pointA].y + 1; i < intersections[pointB].y; i++) {
    grid.set(startingPoint, i, "white");
  }

  console.log(intersections);
}

const { vertLines } = addLines(grid);

for (const startingPoint of vertLines) {
  removeSegment(grid, startingPoint, "vertical");
}

renderGrid(grid, ctx);
