const {Router} = require("express")
const router = Router()
const Feedback = require("../models/feedback")

router.get("/", (req, res)=>{
    res.render("feedback", {
        title: "olx | Feedback"
    })
})
router.get("/read", (req, res)=>{
    res.render("read", {
        title: "olx | Feedback Readers"
    })
})

router.post("/", async (req, res)=>{
    const feedback = await Feedback.create(req.body)    
    res.redirect("/feedback")
})

module.exports = router
