import { useState } from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

export default function App() {
  const [allDies, setAllDies] = useState(() => generateAllNewDice());
  const { width, height } = useWindowSize();

  const gameWon =
    allDies.every((die) => die.isHeld) &&
    allDies.every((die) => die.value === allDies[0].value);

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    }));
  }
  function newGame() {
    setAllDies(generateAllNewDice());
  }
  function rollDice() {
    setAllDies((prevAllDies) =>
      prevAllDies.map((prevDie) => {
        if (prevDie.isHeld === false) {
          return { ...prevDie, value: Math.ceil(Math.random() * 6) };
        }
        return { ...prevDie };
      })
    );
  }
  function toggleHeld(id) {
    setAllDies((prevAllDies) =>
      prevAllDies.map((prevDie) => {
        if (prevDie.id === id) {
          return { ...prevDie, isHeld: !prevDie.isHeld };
        }
        return { ...prevDie };
      })
    );
  }

  const diceElements = allDies.map((dieObj) => (
    <Die
      key={dieObj.id}
      dieId={dieObj.id}
      toggleHeld={toggleHeld}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
    />
  ));
  return (
    <main>
      {gameWon ? <Confetti width={width} height={height} /> : null}
      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>Congratulations! You won! Press "New Game" to start again.</p>
        )}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={gameWon ? newGame : rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
