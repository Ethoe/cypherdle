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
    <div class="virtual-keyboard">
      <div class="keyboard-row">
        <button
          v-for="letter in row1"
          :key="letter"
          @click="handleMobileInput(letter)"
        >
          {{ letter }}
        </button>
      </div>
      <div class="keyboard-row">
        <button
          v-for="letter in row2"
          :key="letter"
          @click="handleMobileInput(letter)"
        >
          {{ letter }}
        </button>
      </div>
      <div class="keyboard-row">
        <button
          v-for="letter in row3"
          :key="letter"
          @click="handleMobileInput(letter)"
        >
          {{ letter }}
        </button>
      </div>
    </div>
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
      row1: "qwertyuiop".toUpperCase().split(""),
      row2: "asdfghjkl".toUpperCase().split(""),
      row3: "zxcvbnm".toUpperCase().split(""),
    };
  },
  async created() {
    try {
      const response = await axios.get("https://ethoe.dev/api/quotes");
      const quote = response.data[0].q; // Extract the quote from the response
      this.cypher = response.data[0].a.length;
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
    },
    handleMobileInput(letter) {
      // Handle touch/click on virtual keyboard button
      this.typedLetter = letter;
      this.guessTable[this.typedLetter] = this.typedLetter;
      if (this.isLetter(this.currentSelection)) {
        this.guesses++;
      }
      this.checkAllLettersGuessed();
    },
    isLetter(letter) {
      return /^[a-zA-Z]$/.test(letter);
    },
    handleKeyDown(event) {
      event.preventDefault();
      const typedLetter = event.key.toLowerCase();
      if (this.isLetter(typedLetter)) {
        this.typedLetter = typedLetter;
        this.guessTable[this.typedLetter] = this.typedLetter;
        if (this.isLetter(this.currentSelection)) {
          this.guesses++;
        }
        this.checkAllLettersGuessed();
      }
    },
    handleInputFocus(event) {
      event.preventDefault();
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
  mounted() {
    document.addEventListener("keydown", this.handleKeyDown);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
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

.virtual-keyboard {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  overflow: auto; /* Enable scrolling if keyboard exceeds viewport height */
}

.keyboard-row {
  display: flex;
  justify-content: center;
}

.virtual-keyboard button {
  width: 40px;
  height: 40px;
  font-size: 16px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.virtual-keyboard button:hover {
  background-color: #ddd;
}

/* Responsive styles using media queries */
@media (max-width: 768px) {
  /* Adjust styles for mobile devices */
  .virtual-keyboard {
    padding: 5px;
    max-height: 50vh; /* Limit height to 50% of viewport height */
  }

  .keyboard-row {
    flex-wrap: wrap; /* Allow keyboard rows to wrap */
  }

  .virtual-keyboard button {
    width: 30px;
    height: 30px;
    font-size: 14px;
    margin: 3px;
  }
}
</style>
