<template>
  <div v-if="isLetter(letter)">
    <h1>{{ guess }}</h1>
    <h3>{{ cypheredLetter }}</h3>
  </div>

  <div v-else-if="letter === ' '"></div>
  <div v-else>
    <h1>{{ letter }}</h1>
  </div>
</template>

<script>
export default {
  name: "CypherLetter",
  props: {
    letter: String,
    cypher: Number,
    current: String,
    currentTyped: String,
  },
  data() {
    return {
      guess: "__",
    };
  },
  computed: {
    cypheredLetter() {
      if (!this.isLetter(this.letter)) {
        return this.letter;
      }
      const lowercaseLetter = this.letter.toLowerCase();

      const currentPosition = lowercaseLetter.charCodeAt(0) - "a".charCodeAt(0);
      const newPosition = (currentPosition + this.cypher) % 26; // Use modulo to wrap around

      let newLetter = String.fromCharCode("a".charCodeAt(0) + newPosition);

      if (this.letter.toUpperCase() === this.letter) {
        newLetter = newLetter.toUpperCase();
      }

      return newLetter;
    },
  },
  methods: {
    isLetter(letter) {
      return /^[a-zA-Z]$/.test(letter);
    },
    currentGuess() {
      if (
        this.isLetter(this.currentTyped) &&
        this.current.toLowerCase() == this.letter.toLowerCase()
      ) {
        if (this.letter.toUpperCase() === this.letter) {
          this.guess = this.currentTyped.toUpperCase();
        } else {
          this.guess = this.currentTyped.toLowerCase();
        }
      }
    },
  },
  watch: {
    currentTyped() {
      this.currentGuess();
    },
  },
};
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

h1 {
  font-size: 24px;
  margin: 5px 0;
  color: #ffffff;
}

h3 {
  font-size: 16px;
  margin: 5px 0;
  color: #d3d2d2;
}
</style>
