require('dotenv').config(); 

const express = require("express")
const cors = require("cors")

const app = express();

const corsOptions = {
    origin:  process.env.NODE_ENV === 'production'
    ? 'https://billions8491.github.io' 
    : 'http://localhost:3000',
    methods: "GET",
};

app.use(cors(corsOptions));



app.get("/steam-deals", async (req, res) => {
    try {
        const response = await fetch('https://store.steampowered.com/api/featuredcategories/');
        const data = await response.json();
        res.json(data)
    } catch(error) {
       res.status(500).json({error: "Failed to fetch Steam data"})
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

  