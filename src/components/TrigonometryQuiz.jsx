import  { useState } from 'react';
import { InlineMath } from 'react-katex';
import { useSpeechSynthesis } from 'react-speech-kit';

const TrigonometryQuiz = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  const { speak } = useSpeechSynthesis();
  console.log(speak)

  const mathQuestion = 'Solve for x: $\\sin(x) = \\frac{1}{2}$';

  const handleAnswerButtonClick = () => {
    setShowSolution(true);
    speak({ text: 'dewa ache ze sin(x) shoman one by two .akhn x shoman sin inverse shoman one by two.orthat x shoman 30 degree ' });
  };

  return (
    <div>
      <h1>Trigonometry Quiz</h1>
      <p>{mathQuestion}</p>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        disabled={showSolution}
      />

      <button onClick={handleAnswerButtonClick} disabled={showSolution}>
        Show Solution
      </button>
      
  
  

      {showSolution && (
        <div>
          <p>
            Solution: <InlineMath math="x = \frac{\pi}{6}" />
          </p>
        </div>
      )}
    </div>
  );
};

export default TrigonometryQuiz;
