const { Router } = require("express");
const Order = require("../models/order");
const router = Router();

router.get("/", async (req, res) => {
  const author = await req.user;
  console.log(author);
  try {
    const orders = await (await Order.find({"user.userId": req.user._id}).populate("user.userId")).reverse(); //faqat shu userni orderlarini ko'rsatadi
    res.render("order", {
        title: "olx | My Orders",
        user: author,
        orders: orders.map( (s) =>({
            ...s._doc,
            price: s.products.reduce((total, c)=>{
                return total += c.count * c.product.price
            }, 0)
        }))
      });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await req.user.populate("card.items.productId");
    const products = user.card.items.map((s) => ({
      product: { ...s.productId._doc },
      count: s.count,
    }));
    const order = new Order({
      user: {
        name: req.user.firstname,
        userId: req.user,
      },
      products: products,
    });
    await order.save();
    await req.user.cleanCard(); // bu order bo'lgandan keyin basketni tozalab tashlaydi va Orderda keyin ko'rinadi ular
    res.redirect("/orders");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
