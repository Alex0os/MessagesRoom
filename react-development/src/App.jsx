import { useRef, useState } from 'react'
import './App.css'

function MessageApp() {
	const [messages, addMessage] = useState([])
	const currentInputValue = useRef("");

	function handleClick() {

		const content = currentInputValue.current.innerText;
		currentInputValue.current.innerText = "";
		addMessage([...messages, content])
	}

	return (
		<>
	      <Board messages={messages}/>
	      <TextInput reference={currentInputValue}/>
	      <div className='button-wrapper'>
	        <button onClick={handleClick} type="button">Submit</button>
	      </div>
		</>
	)
}

function Board({messages}) {
	return (
		<div className='board'>
			{
				messages.map((item, key) => {
					return <div key={key} className='message'>{item}</div>
				})
			}
		</div>
	)
}

function TextInput( {reference} ) {
	return (
		<div ref={reference} className='text-input' contentEditable={true}>
		</div>
	)
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
	  <MessageApp />
    </>
  )
}

export default App
