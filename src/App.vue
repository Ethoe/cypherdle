<template>
  <div class="parent">
    <h1>Cypherdle: Guess the Quote</h1>
    <h3 v-if="completed">You Won in {{ guesses }} guesses!</h3>
    <h3 v-if="completed">Minimum guesses is {{ minGuesses }}.</h3>
    <div class="top">
      <div
        class="letter"
        v-for="letter in statement"
        :key="letter"
        @click="handleClick(letter)"
        :class="{ selected: isSelected(letter), win: completed }"
      >
        <CypherLetter
          :letter="letter"
          :cypher="cypher"
          :current="currentSelection"
          :currentTyped="typedLetter"
        />
      </div>
    </div>
    <input ref="inputBox" @keydown="handleKeyDown" />
  </div>
</template>

<script>
import axios from "axios";
import CypherLetter from "./components/CypherLetter.vue";

export default {
  name: "App",
  components: {
    CypherLetter,
  },
  data() {
    return {
      cypher: 3,
      statement: "",
      guessTable: {},
      currentSelection: "",
      typedLetter: "",
      completed: false,
      guesses: 0,
      minGuesses: 0,
    };
  },
  async created() {
    try {
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const response = await axios.get(
        proxyUrl + "https://zenquotes.io/api/today"
      );
      const quote = response.data[0].q; // Extract the quote from the response
      //var quote = "Hello!, Hello!, Hello!, Hello!, Hello!";
      const lettersString = quote.toLowerCase().replace(/[^a-zA-Z]/g, "");
      const uniqueLetters = Array.from(new Set(lettersString.split("")));
      this.minGuesses = Object.keys(uniqueLetters).length;

      const letterGuesses = {};
      uniqueLetters.forEach((letter) => {
        if (!letterGuesses[letter]) {
          letterGuesses[letter] = "";
        }
      });

      this.statement = quote;
      this.guessTable = letterGuesses;
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  },
  computed: {
    isSelected() {
      return (letter) => {
        if (this.isLetter(letter) && this.isLetter(this.currentSelection)) {
          return letter === this.currentSelection;
        }
        return false;
      };
    },
  },
  methods: {
    handleClick(letter) {
      this.currentSelection = " ";
      this.typedLetter = " ";
      this.currentSelection = letter;
      this.$refs.inputBox.focus();
    },
    isLetter(letter) {
      return /^[a-zA-Z]$/.test(letter);
    },
    handleKeyDown(event) {
      event.preventDefault();
      const typedLetter = event.key;
      if (this.isLetter(typedLetter)) {
        this.typedLetter = typedLetter;
        this.guessTable[this.typedLetter] = this.typedLetter;
        if (this.isLetter(this.currentSelection)) {
          this.guesses++;
        }
        this.checkAllLettersGuessed();
      }
    },
    checkAllLettersGuessed() {
      const allGuessed = Object.values(this.guessTable).every(
        (guess) => guess !== ""
      );
      if (allGuessed) {
        console.log("All letters guessed correctly!");
        this.completed = true;
      }
    },
  },
};
</script>

<style scoped>
div.parent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
div.top {
  display: flex;
  flex-wrap: wrap;
  .selected {
    background-color: #556ae6;
  }

  .win {
    background-color: #4caf50;
  }
}
div.letter:hover {
  background-color: #556ae6;
}

div.letter {
  border: 2px solid #494949;
  border-radius: 8px;
  width: 80px;
  height: 100px;
  margin: 5px;
}
</style>
