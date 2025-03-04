const express = require("express")
const cors = require("cors")

const app = express();

const corsOptions = {
    origin: "*",
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

app.listen(3000, () => {
    console.log("✅ Server is running on http://localhost:3000");
  });
  