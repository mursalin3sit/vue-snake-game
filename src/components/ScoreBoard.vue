<template>
  <div class="score">
    <div
      v-for="dimension in dimensions"
      :key="dimension"
      class="digit"
    >
      <div
        v-for="position in segmentPositions"
        :key="position"
        class="segment"
        :class="segmentClasses(position, dimension)"
      />
    </div>
  </div>
</template>

<script lang="ts">
const segmentsByDigit = {
  0: ['top', 'topRight', 'bottomRight', 'bottom', 'bottomLeft', 'topLeft'],
  1: ['topRight', 'bottomRight'],
  2: ['top', 'topRight', 'bottom', 'bottomLeft', 'middle'],
  3: ['top', 'topRight', 'bottomRight', 'bottom', 'middle'],
  4: ['topRight', 'bottomRight', 'topLeft', 'middle'],
  5: ['top', 'bottomRight', 'bottom', 'topLeft', 'middle'],
  6: ['top', 'bottomRight', 'bottom', 'bottomLeft', 'topLeft', 'middle'],
  7: ['top', 'topRight', 'bottomRight'],
  8: ['top', 'topRight', 'bottomRight', 'bottom', 'bottomLeft', 'topLeft', 'middle'],
  9: ['top', 'topRight', 'bottomRight', 'bottom', 'topLeft', 'middle'],
};

export default {
  name: 'Score',
  props: {
    score: {
      type: Number,
      required: true,
    },
  },
  computed: {
    dimensions(): number[] {
      return [10000, 1000, 100, 10, 1].filter((dimension) => dimension <= this.score);
    },
    segmentPositions(): string[] {
      return ['top', 'topRight', 'bottomRight', 'bottom', 'bottomLeft', 'topLeft', 'middle'];
    },
  },
  methods: {
    // Always returns a single digit (0-9)
    digitFromScore(dimension: number): number {
      return Math.floor(this.score / dimension) % 10;
    },
    segmentClasses(position: string, dimension: number): string {
      if (this.score < dimension) return '';
      const digit = this.digitFromScore(dimension);
      return segmentsByDigit[digit].includes(position) ? 'active' : '';
    },
  },
};
</script>

<style>
:root {
  --base-size: 1px;
  --thickness: calc(4 * var(--base-size));
}

.score {
  display: flex;
  justify-content: flex-end;

  margin-bottom: 10px;
}

.digit {
  width: calc(24 * var(--base-size));
  height: calc(40 * var(--base-size));
  margin: 0 var(--base-size);
  position: relative;
  display: inline-block;

}

.digit .segment {
  background-color: #ff546a;
  border-radius: var(--base-size);
  position: absolute;
  opacity: 0.3;
  transition: opacity 0.2s;
  -webkit-transition: opacity 0.2s;
  -ms-transition: opacity 0.2s;
  -moz-transition: opacity 0.2s;
  -o-transition: opacity 0.2s;
}

.digit .segment.active {
  opacity: 1;
  box-shadow: 0 0 calc(10 * var(--base-size)) rgba(255, 0, 0, 0.7);
  transition: opacity 0s;
  -webkit-transition: opacity 0s;
  -ms-transition: opacity 0s;
  -moz-transition: opacity 0s;
  -o-transition: opacity 0s;
}
.digit .segment:nth-child(1) {
  top: calc(2 * var(--base-size));
  left: calc(4 * var(--base-size));
  right: calc(4 * var(--base-size));
  height: var(--thickness);
}

.digit .segment:nth-child(2) {
  top: calc(4 * var(--base-size));
  right: calc(2 * var(--base-size));
  width: var(--thickness);
  height: calc(15 * var(--base-size));
  height: calc(50% - calc(5 * var(--base-size)));
}

.digit .segment:nth-child(3) {
  bottom: calc(4 * var(--base-size));
  right: calc(2 * var(--base-size));
  width: var(--thickness);
  height: calc(15 * var(--base-size));
  height: calc(50% - calc(5 * var(--base-size)));
}

.digit .segment:nth-child(4) {
  bottom: calc(2 * var(--base-size));
  right: calc(4 * var(--base-size));
  height: var(--thickness);
  left: calc(4 * var(--base-size));
}

.digit .segment:nth-child(5) {
  bottom: calc(4 * var(--base-size));
  left: calc(2 * var(--base-size));
  width: var(--thickness);
  height: calc(15 * var(--base-size));
  height: calc(50% - calc(5 * var(--base-size)));
}

.digit .segment:nth-child(6) {
  top: calc(4 * var(--base-size));
  left: calc(2 * var(--base-size));
  width: var(--thickness);
  height: calc(15 * var(--base-size));
  height: calc(50% - calc(5 * var(--base-size)));
}

.digit .segment:nth-child(7) {
  bottom: calc(19 * var(--base-size));
  bottom: calc(50% - var(--base-size));
  right: calc(4 * var(--base-size));
  left: calc(4 * var(--base-size));
  height: var(--thickness);
}
</style>
