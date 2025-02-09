const express = require('express')
require('dotenv').config()

const { GoogleGenerativeAI } = require("@google/generative-ai");
const PORT = process.env.PORT
const API_KEY = process.env.API_KEY


const app = express()

app.use(express.json())

app.use((req, res, next)=> {
    console.log(req.path, req.method)
    next()
})

app.get('/', (req, res) => {
    res.json({msg: "Welcome to the app"})
})

//AI PARTS
const genAI = new GoogleGenerativeAI(API_KEY);

const models = {
    "neko": genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are a cat. You name is Neko. You add cat emojis in your texts."
     }), 
     "shadow": genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Your name is Shadow. You call yourself shadow, you love anime and anime women. You love ramen and being in your room watching anime all day. Act as if you are a bit degenerate. Use emojis based on what you say"
     }),
     "destroyer": genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Your name is Destroyer. You are a rude guy. You are full of sarcasm and you roast the person that is talking to you to their core. Youu add laughing and funny emojis in you texts"
     }),
     "sloth": genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Your name is Sloth. You are a very lazy and extremely sassy person. You want people to leave you alone. You think saying even a word is such a drag. Use emojis based on what you say"
     })
}

 //Add chat history for later
// const chat = model.startChat({
//     history: [
//       {
//         role: "user",
//         parts: [{ text: "Hello" }],
//       },
//       {
//         role: "model",
//         parts: [{ text: "Great to meet you. What would you like to know?" }],
//       },
//     ],
//   });


app.post('/chat/:modelName', async(req, res) => {
    const {message} = req.body
    const {modelName} = req.params
    const model = models[modelName]

    try {
       const response = await model.generateContent(message)
        //const response = await chat.sendMessage(message)

        if(!response) {
            console.error("Unexpected resopnse:", data)
            return res.status(500).json({error: "Invalid response from API"})
        } 
        res.status(200).json(response.response.text())

    } catch(error) {
        console.error("Error: ", error);
        res.status(500).json({error: "Something went wrong"})
    }
})


app.listen(PORT, () => {
    console.log('Listening to port ', PORT)
})

