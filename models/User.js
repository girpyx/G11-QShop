import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "User ID is required"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        maxlength: [100, "Name cannot be more than 100 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    imageUrl: {
        type: String,
        required: [true, "Image URL is required"],
        trim: true,
    },
    cartItems: {
        type: Object,
        default: {},
        validate: {
            validator: function(v) {
                return typeof v === 'object' && v !== null;
            },
            message: "Cart items must be an object"
        }
    },
}, { 
    minimize: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ _id: 1 });

// Add pre-save middleware for validation
userSchema.pre('save', function(next) {
    if (!this.name || this.name.trim().length === 0) {
        this.name = 'Unknown User';
    }
    next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;





