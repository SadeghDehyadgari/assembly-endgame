import React from "react";
import Header from "../components/Header";
import { languages } from "./languages";
import Chip from "../components/Chip";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "../utils";
import Confetti from "react-confetti";

export default function App() {
  const [currentWord, setCurrentWord] = React.useState(() => getRandomWord());
  const [guessArr, setGuessArr] = React.useState([]);
  const [farewellLanguage, setFarewellLanguage] = React.useState(null);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function countWrongGuess() {
    return guessArr.filter((letter) => !currentWord.includes(letter)).length;
  }

  const wrongGuessCount = countWrongGuess();
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessArr.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameLost || isGameWon;

  function isBtnCorrect(letter) {
    return currentWord.includes(letter);
  }

  function handleLetterSelect(letter) {
    if (!guessArr.includes(letter)) {
      setGuessArr((prev) => [...prev, letter]);
    }
    if (!currentWord.includes(letter)) {
      setFarewellLanguage(languages[wrongGuessCount].name);
    }
  }

  function handleNewGame() {
    setCurrentWord(getRandomWord());
    setGuessArr([]);
    setFarewellLanguage(null);
  }

  React.useEffect(() => {
    function handleKeyDown(e) {
      if (isGameOver) return;
      const key = e.key.toUpperCase();

      if (key >= "A" && key <= "Z") {
        handleLetterSelect(key);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guessArr]);

  const currentWordArr = currentWord.split("").map((letter, index) => (
    <span
      key={index}
      className={clsx("riddle-letter", {
        "missed-letter": isGameLost && !guessArr.includes(letter),
      })}
    >
      {guessArr.includes(letter) || isGameOver ? letter : ""}
    </span>
  ));

  const alphabetMapped = alphabet.split("").map((letter) => (
    <button
      key={letter}
      onClick={() => handleLetterSelect(letter)}
      className={clsx("keyboard-btn", {
        "correct-btn": guessArr.includes(letter) && isBtnCorrect(letter),
        "wrong-btn": guessArr.includes(letter) && !isBtnCorrect(letter),
      })}
      disabled={isGameOver}
      aria-disabled={guessArr.includes(letter)}
      aria-label={`Letter ${letter}`}
    >
      {letter}
    </button>
  ));

  const chipsMapped = languages.map((lang, index) => (
    <Chip
      key={lang.name}
      name={lang.name}
      backgroundColor={lang.backgroundColor}
      color={lang.color}
      class={clsx("chip", {
        lost: index < wrongGuessCount,
      })}
    />
  ));

  return (
    <>
      {isGameOver && !isGameLost ? <Confetti /> : null}
      <Header />
      <main>
        {farewellLanguage && !isGameOver ? (
          <section
            aria-live="polite"
            role="farewell text"
            className="farewell-text"
          >
            {getFarewellText(farewellLanguage)}
          </section>
        ) : (
          <section
            aria-live="polite"
            role="status"
            className={clsx("game-status", {
              "game-won": isGameOver && isGameWon,
              "game-lost": isGameOver && isGameLost,
            })}
          >
            <h3>{isGameWon ? "You Win!" : "You lose!"}</h3>
            <h4>
              {isGameWon ? "Well Done 🎉" : "You should learn Assembly 😂"}
            </h4>
          </section>
        )}

        <section className="languages">{chipsMapped}</section>

        <section className="riddle">{currentWordArr}</section>

        <section className="keyboard">{alphabetMapped}</section>

        {isGameOver && (
          <button className="new-game" onClick={handleNewGame}>
            New Game
          </button>
        )}
      </main>
    </>
  );
}
