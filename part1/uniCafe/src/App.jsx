import { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  return (
    (all === 0) ? (
      <p>No feedback given</p>
    ) : (
      <>
        <table>
          <tbody>
            <StatisticsLine text="good" value={good} />
            <StatisticsLine text="neutral" value={neutral} />
            <StatisticsLine text="bad" value={bad} />
            <StatisticsLine text="all" value={all} />
            <StatisticsLine text="average" value={(good - bad) / all} />
            <StatisticsLine text="positive" value={(good / all) * 100} />
          </tbody>
        </table>
      </>
    )
  )
}

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}:</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good"></Button>
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral"></Button>
      <Button handleClick={() => setBad(bad + 1)} text="bad"></Button>
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App