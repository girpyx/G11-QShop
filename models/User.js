import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    namel: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    cartItemst: {
        type: Object,
        default: {} ,
    },

}, { minimize : false });

const User = mongoose.models.User || mongoose.model("User", userSchema);


export default User;





