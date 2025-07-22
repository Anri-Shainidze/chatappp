import { useEffect, useState } from "react"
import { io } from "socket.io-client"



function App() {
  const [message, setMessage] = useState("")
  const socket = io('http://localhost:3000')
  useEffect(() => {
    
    socket.on('connect', () => {
      console.log("Connect to server")
    })
    return () => { socket.disconnect() }
  }, [socket])
  socket.on("send", (data) => {
    console.log("Received Data " + data.message)
  })
  socket.on('timer', (data) => {
    console.log(data.message)
  })
  const handleSend = () => {
    socket.emit('send', { message })
  }
  return (
    <>
      <div>
        <input type="text" onChange={(e) => setMessage(e.target.value)} />
        <button onClick={handleSend}>Send</button>
      </div>
    </>
  )
}

export default App
