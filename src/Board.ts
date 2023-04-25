import { Direction, Status } from './types';

const candy = "candy";

const convertToRowColumn = ({ index, width }: { index: number, width: number }): { row: number, column: number } => {
  const row = Math.floor(index / width);
  const column = index % width;
  return { row, column };
};
class Snake {
  private readonly arr: number[] = [];

  constructor(initalIndices: number[]) {
    initalIndices.forEach((index) => this.arr.push(index));
  }

  get currentHeadIndex() {
    return this.arr[0];
  }

  get currentTailIndex() {
    return this.arr[this.arr.length - 1];
  }

  get length() {
    return this.arr.length;
  }

  nextHeadIndex(direction: Direction, width: number, height: number): number {
    switch (direction) {
      case Direction.RIGHT:
        const onRightEnd = (this.currentHeadIndex + 1) % width === 0;
        return onRightEnd ? this.currentHeadIndex - width + 1 : this.currentHeadIndex + 1;
      case Direction.LEFT:
        const onLeftEnd = this.currentHeadIndex % width === 0;
        return onLeftEnd ? this.currentHeadIndex + width - 1 : this.currentHeadIndex - 1;
      case Direction.UP:
        const onTop = this.currentHeadIndex < width;
        return onTop ? this.currentHeadIndex + width * (height - 1) : this.currentHeadIndex - width;
      case Direction.DOWN:
        return (this.currentHeadIndex + width) % (width * height);
    }
  }

  move(ateCandy: boolean, newHeadIndex: number): void {
    if (!ateCandy) this.arr.pop();
    this.arr.unshift(newHeadIndex);
  }

  occupiesBoardIndex(index: number): boolean {
    return this.arr.slice(0, this.arr.length -1).includes(index);
  }

  movementDirection(width: number, height: number): Direction {
    const first = this.arr[0];
    const second = this.arr[1];
    const { row: firstRow, column: firstColumn } = convertToRowColumn({ index: first, width });
    const { row: secondRow, column: secondColumn } = convertToRowColumn({ index: second, width });

    const lastRow = height - 1;
    const lastColumn = width - 1;

    if (firstColumn === lastColumn && secondColumn === 0) return Direction.LEFT;
    if (firstColumn === 0 && secondColumn === lastColumn) return Direction.RIGHT;
    if (firstRow === 0 && secondRow === lastRow) return Direction.DOWN;
    if (firstRow === lastRow && secondRow === 0) return Direction.UP;

    if (firstRow > secondRow) return Direction.DOWN;
    if (firstRow < secondRow) return Direction.UP;
    if (firstColumn > secondColumn) return Direction.RIGHT;
    if (firstColumn < secondColumn) return Direction.LEFT;

    throw new Error('This should not happen!')
  }

  invertedMovementDirection(width: number, height: number): Direction {
    const direction = this.movementDirection(width, height);
    switch (direction) {
      case Direction.LEFT: return Direction.RIGHT;
      case Direction.RIGHT: return Direction.LEFT;
      case Direction.UP: return Direction.DOWN;
      case Direction.DOWN: return Direction.UP;
    }
  }
}

export class Board {
  private readonly snake: Snake;
  private readonly arr: string[];

  constructor(public readonly width: number, public readonly height: number, public readonly withWalls: Boolean) {
    this.arr = new Array(width * height).fill('');
    this.arr[10] = candy;
    this.snake = new Snake([2, 1, 0]);
    this.arr[2] = 'snake from-left head';
    this.arr[1] = 'snake from-left to-right';
    this.arr[0] = 'snake to-right tail';
  }

  get score() {
    return this.snake.length * 100;
  }

  willCollide({ oldHeadIndex, newHeadIndex, direction }: { oldHeadIndex: number, newHeadIndex: number, direction: Direction }): Boolean {
    if (this.snake.occupiesBoardIndex(newHeadIndex)) return true;
    if (!this.withWalls) return false;

    // Check if the snake will collide with the outer walls
    const { row: oldRow, column: oldColumn } = convertToRowColumn({ index: oldHeadIndex, width: this.width });
    const { row: newRow, column: newColumn } = convertToRowColumn({ index: newHeadIndex, width: this.width });
    if (direction === Direction.RIGHT && newColumn < oldColumn) return true;
    if (direction === Direction.LEFT && newColumn > oldColumn) return true;
    if (direction === Direction.UP && newRow > oldRow) return true;
    if (direction === Direction.DOWN && newRow < oldRow) return true;

    return false;
  }

  nextTick(direction: Direction): Status {
    const oldTailIndex = this.snake.currentTailIndex;
    const oldHeadIndex = this.snake.currentHeadIndex;
    const newHeadIndex = this.snake.nextHeadIndex(direction, this.width, this.height);

    if (this.willCollide({ oldHeadIndex, newHeadIndex, direction })) return Status.COLLIDED;

    const ateCandy = this.arr[newHeadIndex] === candy;

    this.snake.move(ateCandy, newHeadIndex);

    this.arr[newHeadIndex] = `snake from-${this.snake.invertedMovementDirection(this.width, this.height).toLowerCase()} head`;
    const oldHeadClasses = this.arr[oldHeadIndex].split(' ');
    this.arr[oldHeadIndex] = oldHeadClasses.slice(0, oldHeadClasses.length - 1).join(' ') + ` to-${direction.toLowerCase()}`;
    if (!ateCandy && oldTailIndex !== newHeadIndex) this.arr[oldTailIndex] = "";

    if (ateCandy) {
      const freeIndices = this.arr.map((item, index) => {
        if (item) return null;
        return index;
      }).filter((item) => item);
      const number = Math.floor(Math.random() * freeIndices.length);
      const candyIndex = freeIndices[number];
      this.arr[candyIndex] = candy;
    } else {
      // snake from-left to-right
      // snake to-right
      // Remove from-xxx class from tail
      const newTailIndex = this.snake.currentTailIndex;
      const old = this.arr[newTailIndex].split(' ');
      this.arr[newTailIndex] = `snake tail ${old[old.length - 1]}`;
    }

    if (ateCandy) return Status.ATE;
    return Status.MOVED;
  };

  serialize() : string[] {
    return [...this.arr];
  }

  allowedMovementDirections() : Direction[] {
    const allDirections = Object.values(Direction);
    if (this.snake.length < 2) return allDirections;

    const invertedMovementDirection = this.snake.invertedMovementDirection(this.width, this.height);
    return allDirections.filter((d) => d !== invertedMovementDirection);
  }
}
