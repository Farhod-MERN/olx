const {Router} = require("express")
const router = Router()
const Product = require("../models/product")
const authMiddleware = require("../middleware/auth")

function mapCard(card){
    return card.items.map((s) =>({
        ...s.productId._doc,
        count: s.count 
    }))
}

function productPrice(products){
    return products.reduce((total, product)=>{
        return total += product.price * product.count
    }, 0)
}

router.post("/add", authMiddleware, async (req, res)=>{
    const product = await Product.findById(req.body.id)
    await req.user.AddToCard(product)
    res.redirect("/card")
})

router.get("/",authMiddleware, async (req, res)=>{
    const user = await req.user.populate("card.items.productId") // bu yerda populate qilinishi kerak massivgacha yo'l va massivdagi nimani populate qilishni ko'rsatiladi

    const products = mapCard(user.card)
    res.render("card", {
        title: "olx | Card",
        products: products,
        price: productPrice(products)
    })
})

router.delete("/remove/:id", authMiddleware,async (req, res)=>{
    await req.user.removeFromCard(req.params.id)
    const user = await req.user.populate("card.items.productId")
    const products = mapCard(user.card)
    const card = {
        products,
        price: productPrice(products)
    }
    res.status(200).json(card)
    // const card = await Card.remove(req.params.id)
})


module.exports = router