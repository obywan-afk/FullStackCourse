import { useState } from 'react'

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
          <td>{text}</td>
          <td>{value}</td>
    </tr>
  );
};


const Statistics = ({ good, neutral, bad, totalFeedback, averageFeedback, positivePercentage }) => {
  if (totalFeedback === 0) {
    return (
      <div>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </div>
    );
  }
  return (
    <div>
      <h2>statistics</h2>
      <table>
      <tbody>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={totalFeedback} />
      <StatisticLine text="average" value={isNaN(averageFeedback) ? 0 : averageFeedback.toFixed(2)} />
      <StatisticLine text="positive" value={positivePercentage} />
      </tbody>
      </table>
    </div>
  );
};


const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1);
  const handleNeutral = () => setNeutral(neutral + 1);
  const handleBad = () => setBad(bad + 1);

  const totalFeedback = good + neutral + bad;
  const averageFeedback = (good - bad) / totalFeedback;
  const positivePercentage = totalFeedback === 0 ? "0%" : `${((good / totalFeedback) * 100).toFixed(1)}%`;

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text="good" />
      <Button handleClick={handleNeutral} text="neutral" /> 
      <Button handleClick={handleBad} text="bad" />
          <Statistics
            good={good}
            neutral={neutral}
            bad={bad}
            totalFeedback={totalFeedback}
            averageFeedback={averageFeedback}
            positivePercentage={positivePercentage}
          />
   </div>
  );
}

export default App



