import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Board() {
	return (
		<div className='board'>
		</div>
	)
}

function TextInput() {
	return (
		<div className='text-input' contentEditable={true}>
		</div>
	)
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
	  <Board />
	  <TextInput />
	  <div className='button-wrapper'>
	    <button type="button">Submit</button>
	  </div>
    </>
  )
}

export default App
