const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  address: { type: String, required: true },
  number: { type: Number, required: true },
  password: { type: String, required: true },
  gander: { type: String, default: "optional" },
  bio: { type: String, default: "Your bio is here" },
  ico: { type: String, default: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" },
  card: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
})

// function dan foydalan arrow func dan emas , sababi function o'zining Context thisiga ega
userSchema.methods.AddToCard = function (product) {
  let items = [...this.card.items]

  const index = items.findIndex(s => {
    return s.productId.toString() === product._id.toString()  //userID va _id ObjectID formatda , ularni tenglashda muammo bo'lishi mumkun, shunga stringa o'tkazib tengladim
  })
  // agar product savatda bo'lsa
  if (index >= 0) {
    items[index].count = items[index].count + 1
  } else {
    items.push({
      productId: product._id,
      count: 1,
    })
  }
  // const newCard = { this.card.items: items}
  // this.card = newCard
  this.card = { items }

  return this.save() //keyin o'zgarishlarni saqlab qo'yish kerak

}

userSchema.methods.removeFromCard = function (id) {
  let items = [...this.card.items]
  const index = items.findIndex(s => s.productId.toString() === id.toString())
  if (items[index].count === 1) {
    items = items.filter(s => s.productId.toString() !== id.toString())
  } else {
    items[index].count--
  }

  this.card = { items }
  return this.save()
}

userSchema.methods.cleanCard = function(){
  this.card = {items : []}
  return this.save()
}

module.exports = model("User", userSchema)