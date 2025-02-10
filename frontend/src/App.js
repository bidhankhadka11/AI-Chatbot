import { useState } from "react";

function App() {
  //states
  const  [message, setMessage] = useState('')
  const [model, setModel] = useState('neko')
  const [convo, setConvo] = useState([])

  //function starts when submit button is clicked
  const handleSubmit = async (e) => {
    e.preventDefault()

    //Store the messages sent by the user and the previous states
    setConvo((prev) => [...prev, {sender: "user", text: message}])

    const input = {message}

    //Sends a post request to the backend
    const response = await fetch(`/chat/${model}/`, {
      method: 'POST',
      body: JSON.stringify(input),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    //gets sends a response messsage
    const json = await response.json()

    //Store the output sent by the bot
    setConvo((prev) => [...prev, {sender: "bot", text: json}])
    setMessage('')  //Resets the typed text in the text box
  }

  return (
    <div className="App">

    <div className="header">
      <h1>Chat with AI</h1>
      {/* Bot selection */}
      <select id="options" name="options" 
      onChange={(e) => {
        setModel(e.target.value)
        setConvo([])
      }}>
        <option value="neko">Neko - The Cat</option>
        <option value="shadow">Shadow - The anime nerd</option>
        <option value="destroyer">Destroyer - The rude fella</option>
        <option value="sloth">Sloth</option>
      </select>
    </div>

    {/* Chat Display */}
    <div className="chat-output">
      {convo.map((message, index) => (
        <div key={index} className={`message ${message.sender}`}>
          {message.text}
        </div>
           
      ))}
      {/* <div className="message bot">{output}</div> Bot response */}
    </div>

    <form className="input-area" onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        placeholder="Type a message..."
      />
      <button>Send</button>
    </form>
  </div>
  );
}

export default App;
