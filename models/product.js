const {Schema, model} = require("mongoose")

const productSchema = new Schema({
        name: {type: String, required: true},
        quality: {type: String, required: true},
        tel: {type: Number, required: true},
        description: {type: String, required: true},
        image: {type: String, required: true},
        category: {type: String, required: true},
        address:{type: String, required: true},
        price: {type: Number, required: true},
        userId: {type: Schema.Types.ObjectId, ref: "User", required: true}
})

module.exports = model("Product", productSchema)