<template>
  <div class="game">
    <div
      v-if="showOverlay"
      class="overlay"
    >
      <button
        v-if="status === 'INITIALIZED'"
        class="call-to-action"
        @click="onStart"
      >
        Start Game
      </button>
      <div v-if="status === 'COLLIDED'">
        <div>Game Over!</div>
        <button
          class="call-to-action"
          @click="onRestart"
        >
          Play again
        </button>
      </div>
    </div>
    <ScoreBoard :score="score" />
    <div class="board">
      <div
        ref="containerRef"
        class="board-grid"
        :tabindex="-1"
        @keydown.up.left.down.right.prevent="handleKeypress"
      >
        <div
          v-for="(item, index) in boardArray"
          :key="index"
          class="grid-item"
          :class="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue';
import { useSnakeGame } from '../composables/useSnakeGame';
import { Direction, Status } from '../types';
import ScoreBoard from './ScoreBoard.vue';

export default {
  name: 'Board',
  components: {
    ScoreBoard,
  },
  props: {
    width: {
      type: Number,
      default: 7,
    },
    height: {
      type: Number,
      default: 7,
    },
    fps: {
      type: Number,
      default: 4,
    },
    withWalls: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const {
      boardArray,
      changeDirection,
      start,
      restart,
      status,
      score,
    } = useSnakeGame({ ...props });

    const handleKeypress = ({ key }) => {
      const mapping = {
        ArrowUp: Direction.UP,
        ArrowDown: Direction.DOWN,
        ArrowLeft: Direction.LEFT,
        ArrowRight: Direction.RIGHT,
      };
      const mapped = mapping[key];
      changeDirection(mapped);
    };

    const showOverlay = computed(() => {
      if (status.value === Status.INITIALIZED) return true;
      if (status.value === Status.COLLIDED) return true;
      return false;
    });

    const containerRef = ref(null);
    const focusBoard = () => containerRef.value.focus();
    const onStart = () => {
      focusBoard();
      start();
    };
    const onRestart = () => {
      focusBoard();
      restart();
    };

    return {
      boardArray,
      changeDirection,
      handleKeypress,
      showOverlay,
      status,
      score,
      containerRef,
      onStart,
      onRestart,
    };
  },
};
</script>

<style scoped vars="{ width, height }">
* {
  box-sizing: border-box;
}

.game {
  position: relative;
  width: 400px;
  height: 490px;

  background-color: #008990;
  padding: 20px;
}

.overlay {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background-color: hsla(0, 0%, 100%, 0.8);
}

.board {
  height: 400px;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(var(--width), minmax(0, 1fr));
  grid-template-rows: repeat(var(--height), minmax(0, 1fr));
  width: 100%;
  height: 100%;
  outline: 0;
  margin: 0 auto;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.grid-item:nth-child(even) {
  background-color: hsla(183, 28%, 84%, 100%);
}
.grid-item:nth-child(odd) {
  background-color: hsla(183, 28%, 84%, 50%);
}

.call-to-action {
  appearance: none;
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
  max-width: 100%;
  border: 2px solid hsl(352, 100%, 66%);
  border-radius: 4px;
  padding: 0.6em 1.2em;
  font-weight: 600;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: hsl(0, 0%, 100%);
  background-color: hsl(352, 100%, 66%);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.call-to-action::after {
  content: "›";
  display: inline-block;
  position: relative;
  width: 14px;
  margin-left: 8px;
  transition: transform 0.2s ease-in-out;
}

.call-to-action:hover,
.call-to-action:focus {
  border-color: hsl(352, 65%, 51%);
  text-decoration: none;
  color: hsl(0, 0, 100%);
  background-color: hsl(352, 65%, 51%);
}

.call-to-action:hover::after,
.call-to-action:focus::after {
  transform: translateX(2px);
}

.candy::before {
  content: "";
  display: block;
  width: 75%;
  height: 75%;
  background-image: url("/snake/corona.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.snake {
  position: relative;
  background-repeat: no-repeat;
  background-size: contain;
}

.snake::before {
  content: "";
  width: 100%;
  height: 100%;
  background-color: #008990;
  background-image: radial-gradient(
      circle,
      hsl(160, 100%, 33%) 15%,
      transparent 10%
    ),
    radial-gradient(circle, hsl(160, 100%, 33%) 15%, transparent 10%);
  background-position: 0 0, 10px 10px;
  background-size: 10px 10px;
}

/* Head */
.head::after {
  content: "";
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-image: url("/snake/face.svg");
  background-repeat: no-repeat;
  background-size: contain;
}

.head.from-right {
  justify-content: flex-end;
}

.head.from-left {
  justify-content: flex-start;
}
.head.from-left::after {
  transform: rotate(180deg);
}

.head.from-up {
  align-items: flex-start;
}
.head.from-up::after {
  transform: rotate(270deg);
}

.head.from-down {
  align-items: flex-end;
}
.head.from-down::after {
  transform: rotate(90deg);
}

.head.from-left::before {
  width: 70%;
  height: 70%;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}

.head.from-right::before {
  width: 70%;
  height: 70%;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}

.head.from-up::before {
  width: 70%;
  height: 70%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}

.head.from-down::before {
  width: 70%;
  height: 70%;
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
}

/* Tail */
.tail.to-left::before {
  height: 70%;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}

.tail.to-right::before {
  height: 70%;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}

.tail.to-up::before {
  width: 70%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}

.tail.to-down::before {
  width: 70%;
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
}

/* Middle */
.from-left.to-right::before,
.from-right.to-left::before {
  height: 70%;
}

.from-down.to-up::before,
.from-up.to-down::before {
  width: 70%;
}

/* Curve */
.from-left.to-down,
.from-down.to-left {
  justify-content: flex-start;
  align-items: flex-end;
}
.from-left.to-down::before,
.from-down.to-left::before {
  width: 85%;
  height: 85%;
  border-top-right-radius: 100%;
}
.from-left.to-down::after,
.from-down.to-left::after {
  content: "";
  position: absolute;
  width: 15%;
  height: 15%;
  border-top-right-radius: 100%;
  background-color: hsla(183, 28%, 84%, 100%);
}

.from-left.to-up,
.from-up.to-left {
  justify-content: flex-start;
  align-items: flex-start;
}
.from-left.to-up::before,
.from-up.to-left::before {
  width: 85%;
  height: 85%;
  border-bottom-right-radius: 100%;
}
.from-left.to-up::after,
.from-up.to-left::after {
  content: "";
  position: absolute;
  width: 15%;
  height: 15%;
  border-bottom-right-radius: 100%;
  background-color: hsla(183, 28%, 84%, 100%);
}

.from-right.to-up,
.from-up.to-right {
  justify-content: flex-end;
  align-items: flex-start;
}
.from-right.to-up::before,
.from-up.to-right::before {
  width: 85%;
  height: 85%;
  border-bottom-left-radius: 100%;
}
.from-right.to-up::after,
.from-up.to-right::after {
  content: "";
  position: absolute;
  width: 15%;
  height: 15%;
  border-bottom-left-radius: 100%;
  background-color: hsla(183, 28%, 84%, 100%);
}

.from-right.to-down,
.from-down.to-right {
  justify-content: flex-end;
  align-items: flex-end;
}
.from-right.to-down::before,
.from-down.to-right::before {
  width: 85%;
  height: 85%;
  border-top-left-radius: 100%;
}
.from-right.to-down::after,
.from-down.to-right::after {
  content: "";
  position: absolute;
  width: 15%;
  height: 15%;
  border-top-left-radius: 100%;
  background-color: white;
}
</style>
