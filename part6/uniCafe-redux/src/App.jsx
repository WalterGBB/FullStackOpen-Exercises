import { useSelector, useDispatch } from 'react-redux'
import { voteGood, voteNeutral, voteBad } from './modules/feedbackSlice'
import Statistics from './components/Statistics'

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {
  const { good, neutral, bad } = useSelector((state) => state.feedback)
  const dispatch = useDispatch()

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={() => dispatch(voteGood())} text="good" />
      <Button handleClick={() => dispatch(voteNeutral())} text="neutral" />
      <Button handleClick={() => dispatch(voteBad())} text="bad" />
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
