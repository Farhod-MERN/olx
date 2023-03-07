const {Schema, model} = require("mongoose")

const feedbackSchema = new Schema({
    name:{type:String, required: true},
    mark: {type: String, required: true},
    message: {type: String, required: true},
})

module.exports = model("Feedback", feedbackSchema)