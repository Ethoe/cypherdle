<template>
  <div class="app">
    <HeaderComponent title="Cypherdle: Guess the Quote" />
    <main class="main-content">
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
    </main>
  </div>
</template>

<script>
import axios from "axios";
import CypherLetter from "./components/CypherLetter.vue";
import HeaderComponent from "./components/Header.vue";

export default {
  name: "App",
  components: {
    CypherLetter,
    HeaderComponent,
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
      this.typedLetter = letter.toLowerCase();
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

<style>
body {
  margin: 0;
  background-color: #303033; /* Set background color for the body */
}
</style>

<style scoped>
h3 {
  color: #fff;
}
.app {
  font-family: Arial, sans-serif;
  background-color: #303033;
  min-height: 100vh; /* Ensure the app container fills the viewport height */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding-bottom: 175px;
}
@media (max-width: 768px) {
  .main-content {
    padding-bottom: 127px;
  }
}

div.top {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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

@media (max-width: 768px) {
  div.letter {
    width: 60px;
    height: 80px;
    margin: 3px;
  }
}

@media (max-width: 480px) {
  div.letter {
    width: 40px;
    height: 60px;
    margin: 2px;
  }
}

.virtual-keyboard {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #303033;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.keyboard-row {
  display: flex;
  justify-content: center;
}

.virtual-keyboard button {
  width: 40px;
  height: 40px;
  font-size: 20px;
  color: #f3f1f1;
  margin: 5px;
  border: 1px solid #918d8d;
  border-radius: 5px;
  background-color: #918d8d;
  cursor: pointer;
  text-align: center;
}

.virtual-keyboard button:hover {
  background-color: #ddd;
}

@media (max-width: 768px) {
  .virtual-keyboard {
    padding: 5px;
    max-height: 50vh;
    height: 102px;
  }

  .keyboard-row {
    flex-wrap: wrap;
  }

  .virtual-keyboard button {
    width: 30px;
    height: 30px;
    font-size: 14px;
    margin: 2px;
  }
}
</style>
