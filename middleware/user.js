const User = require("../models/user")

module.exports = async function(req, res, next){
    //login bo'lganda , userni malumotlarini session.user ga saqlardik
    if(!req.session.user){
        return next()
    }
    // user login qilganidan keyin , req.user ishlay boshlaydi
    // req.userdan olganmiz Basket va orderdagi malumotlarni 
    req.user = await User.findById(req.session.user._id)
    res.locals.userInfo = await User.findById(req.session.user._id)
    next()
}