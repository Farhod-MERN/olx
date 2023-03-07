const {Router} = require("express")
const Product = require("../models/product")
const User = require("../models/user")
const path = require("path")

const router = Router()

router.get("/", async(req, res)=>{
    try {
    const products = await Product.find().populate("userId", "email name")
    res.render("products", {
        title: "olx - Products",
        isProduct: true,
        userId: req.user ? req.user._id.toString() : null, 
        products: products.reverse(),
    })
    } catch (error) {
        console.log(error);
    }
})

router.get("/laptop", async(req, res)=>{
    const products = await Product.find({category : "Laptop"})
    res.render("products", {
        title: "olx - Products",
        isProduct: true,
        products: products ? products.reverse() : [],
    })
})
router.get("/phone", async(req, res)=>{
    const products = await Product.find({category : "Phone"})
    res.render("products", {
        title: "olx - Products",
        isProduct: true,
        products: products ? products.reverse() : [],
    })
})
router.get("/equipment", async(req, res)=>{
    const products = await Product.find({category : "Equipment"})
    res.render("products", {
        title: "olx - Products",
        isProduct: true,
        products: products ? products.reverse() : [],
    })
})
router.get("/other", async(req, res)=>{
    const products = await Product.find({category: "Other"})
    res.render("products", {
        title: "olx - Products",
        isProduct: true,
        products: products ? products.reverse() : [],
    })
})
router.get("/:id/edit", async (req, res)=>{
    try{
    const id = req.params.id
    const product = await Product.findById(id)
    
    if(product.userId._id.toString() !== req.user._id.toString()){
        res.redirect("/")
    }
    
    if(!req.query.allow){
        return res.redirect("/")
    }

    res.render("edit-product",{
        title: `Edit ${product.name}`,
        product: product,
        userId: req.user ? req.user._id.toString() : null, 

    })
    }catch(e){
        console.log(e);
    }
})
router.get("/remove/:id", async (req, res)=>{
    // Product.deleteOne({_id: req.params.id})
    try {
        await Product.findByIdAndRemove(req.params.id)
        res.redirect("/products")
    } catch (error) {
        console.log(error);        
    }
})

router.get("/:id", async (req, res)=>{
    const id = req.params.id
    const product = await Product.findById(id)
    const user = await User.findById(product.userId)
    res.render("detail", {
        product: product,
        user: user,
    })
})
router.post("/edit", async (req, res)=>{
  const { image } = await req.files;
  const png = image.name.slice(image.name.length - 4) === ".png"
  const jpg = image.name.slice(image.name.length - 4) === ".jpg"
  const jpeg = image.name.slice(image.name.length - 5) === ".jpeg"

  image.mv(path.resolve(__dirname, "..", "public/posts", image.name), async(err) => {
    if (err) {
      console.log(err);
    }
    const product = {
        name: req.body.name,
        quality: req.body.quality,
        tel: req.body.tel,
        description: req.body.description,
        image: png || jpg || jpeg ? `/posts/${image.name}` : "https://ingoodcompany.asia/images/products_attr_img/matrix/default.png",
        category: req.body.category,
        address: req.body.address,
        price: req.body.price,
        userId: req.user,
      }
    await Product.findByIdAndUpdate(req.body.id, product)
    
  });
    res.redirect("/products")
})

module.exports = router