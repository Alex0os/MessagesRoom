import { useEffect, useRef, useState } from 'react'
import './App.css'

const WS = new WebSocket("ws://127.0.0.1:8000/")

function MessageApp() {
	const [messages, addMessage] = useState([])
	const inputFieldRef = useRef("");

	useEffect(() => {
		WS.addEventListener("message", (event) => {
			addMessage([...messages, event.data]);
		});
	}, [messages]);

	function handleClick() {
		const content = inputFieldRef.current.innerText;
		inputFieldRef.current.innerText = "";

		addMessage([...messages, content])
		WS.send(content);

		inputFieldRef.current.focus();
	}

	return (
		<>
	      <Board messages={messages}/>
	      <TextInput reference={inputFieldRef}/>
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
