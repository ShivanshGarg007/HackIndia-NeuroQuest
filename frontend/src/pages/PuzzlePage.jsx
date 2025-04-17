
import { useEffect, useState } from "react";
// import { getDailyPuzzle, submitAttempt } from "../services/puzzleService";
import "../styles/PuzzlePage.css";

function PuzzlePage() {
  const [puzzle, setPuzzle] = useState(null);
  const [answer, setAnswer] = useState("");
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    getDailyPuzzle().then((res) => {
      setPuzzle(res.data);
      setStartTime(Date.now());
    });
  }, []);

  const handleSubmit = () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    submitAttempt({
      puzzleId: puzzle._id,
      userAnswer: answer,
      timeTaken,
    }).then(() => {
      alert("Submitted!");
    });
  };

  return puzzle ? (
    <div className="puzzle-container">
      <h1 className="question">{puzzle.question}</h1>
      <div className="options">
        {puzzle.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setAnswer(opt)}
            className={`option-button ${answer === opt ? "selected" : ""}`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default PuzzlePage;
