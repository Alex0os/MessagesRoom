import { useEffect, useRef, useState } from 'react'
import './App.css'

const WS = new WebSocket("wss://localhost:8080/ws");
const USER_NAME = function() { return document.cookie.split("=")[1] }();

function MessageApp() {
	const [messages, addMessage] = useState([])
	const inputFieldRef = useRef("");

	useEffect(() => {
		WS.addEventListener("message", (event) => {
			let messageData = JSON.parse(event.data);
			if (messageData.user !== USER_NAME)
				addMessage([...messages, messageData]);
		});
	}, [messages]);

	function handleClick() {
		const content = inputFieldRef.current.innerText;
		inputFieldRef.current.innerText = "";


		let userInfo = {
			user: USER_NAME,
			content: content
		}

		addMessage([...messages, userInfo]);
		WS.send(JSON.stringify(userInfo));

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
					return (
						<div key={key} className='message'>
							{item.user}
							<div>
								{item.content}
							</div>
						</div>)
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
