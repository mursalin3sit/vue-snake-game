import { ref } from 'vue';
import { Direction } from '../types';

const allowedNewDirectionsByOldDirection = {
  LEFT: ['UP', 'DOWN'],
  RIGHT: ['UP', 'DOWN'],
  UP: ['LEFT', 'RIGHT'],
  DOWN: ['LEFT', 'RIGHT'],
};

export const useDirection = (startDirection: Direction = Direction.RIGHT) => {
  const direction = ref(startDirection);
  const directions = [Direction.RIGHT, Direction.LEFT, Direction.UP, Direction.DOWN];
  const changeDirection = (newDirection: Direction) => {
    const allowedDirections = allowedNewDirectionsByOldDirection[direction.value];
    if (!allowedDirections.includes(newDirection)) return;

    direction.value = newDirection;
  };

  return {
    direction,
    directions,
    changeDirection,
  };
};
