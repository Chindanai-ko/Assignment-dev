import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
    HN: {
        type: String,
        required: true,
        unique: true,
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },  
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
},
{
    timestamps: true
}
);

const Owner = mongoose.model("Owner", ownerSchema);

export default Owner;