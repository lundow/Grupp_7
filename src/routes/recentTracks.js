const express = require("express")
const router = express.Router();

router.get("/asdf", async (req, res) => {
    try{
        res.status(200).send("asdf")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router