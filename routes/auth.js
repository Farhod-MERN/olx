const { Router } = require("express");
const User = require("../models/user");
const router = Router();
const bcrypt = require("bcrypt")
const {body, validationResult} = require("express-validator/check")
const {regVal} = require("../utils/validate")
router.get("/register", async (req, res) => {
  res.render("register", {
    title: "olx | Register",
    regError: req.flash("regError"),
    data: req.flash("data")[0]
  });
});
router.get("/login", async (req, res) => {
  res.render("login", {
    title: "olx | Log in",
    loginError: req.flash("loginError")
  });
});
router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });
    if (candidate) {
      const samePass = await bcrypt.compare(password, candidate.password)
      if (samePass) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;

        req.session.save((err) => {
          if (err) throw err;
          res.redirect("/");
          console.log(req.body);
        });
      }else{
        req.flash("loginError", "Your password is wrong")
        res.redirect("/auth/login")
      }
    } else {
      req.flash("loginError", "User not found")
      res.redirect("/auth/login");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/register",regVal ,async (req, res) => {
  try {
    const {
      email,
      firstname,
      lastname,
      address,
      number,
      password,
      gander,
    } = req.body;

    const errors = validationResult(req)
    if(!errors.isEmpty()){
      req.flash("regError", errors.array()[0].msg)
      req.flash("data", req.body)
      return res.status(422).redirect("/auth/register")
    }
    
    const hashPass = await bcrypt.hash(password, 10)
      const user = new User({
        email,
        firstname,
        lastname,
        address,
        number,
        password: hashPass,
        gander,
        card: { items: [] },
      });

      await user.save();
      res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
