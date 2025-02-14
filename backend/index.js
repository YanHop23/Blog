import express from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"



const app = express()
mongoose.connect(process.env.MONGODB_URI, {})
app.use(express.json())
app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/auth/login", (req, res) => {
    console.log(req)

    const token = jwt.sign({
        email: req.body.email,
        fullName: "Олежка",
    },
    "secret"
    )

    res.json({
        status: "success",
        token: token,
    })
})

app.listen(4444, (error) => {
    if (error) {
        return console.error(error)
    }

    console.log("Server started on port 4444")

})

