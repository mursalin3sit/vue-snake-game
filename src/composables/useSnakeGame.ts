import { ref, readonly, onBeforeUnmount } from 'vue';

import { useDirection } from './useDirection';
import { Board } from '../Board';
import { Direction, Status } from '../types';

export const useSnakeGame = (
  {
    width, height, fps, withWalls,
  }: {
    width: number,
    height: number,
    fps: number,
    withWalls: boolean,
  },
) => {
  let handle: NodeJS.Timeout = null;
  let board = new Board(width, height, withWalls);
  const boardArray = ref(board.serialize());
  const updateInterval = 1000 / fps;
  const status = ref(Status.INITIALIZED);
  const score = ref(board.score);

  const { direction, changeDirection } = useDirection();

  const updateBoard = () => {
    status.value = board.nextTick(direction.value);
    switch (status.value) {
      case Status.COLLIDED:
        clearInterval(handle);
        return;
      case Status.ATE:
      case Status.MOVED:
        score.value = board.score;
        boardArray.value = board.serialize();
        break;
      default:
    }
  };

  const start = () => {
    handle = setInterval(updateBoard, updateInterval);
    status.value = Status.MOVED;
  };
  const restart = () => {
    board = new Board(width, height, withWalls);
    direction.value = Direction.RIGHT;
    boardArray.value = board.serialize();
    start();
  };
  const pause = () => { clearInterval(handle); };

  onBeforeUnmount(() => clearInterval(handle));

  const tryChangeDirection = (newDirection: Direction): void => {
    const allowed = board.allowedMovementDirections();
    if (allowed.includes(newDirection)) changeDirection(newDirection);
  };

  return {
    start,
    restart,
    pause,
    changeDirection: (newDirection) => tryChangeDirection(newDirection),
    status: readonly(status),
    score: readonly(score),
    boardArray: readonly(boardArray),
  };
};
