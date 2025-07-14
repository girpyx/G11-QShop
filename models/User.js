import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String, // If using external auth provider's user ID, ensure all user creation provides this as a string
        required: [true, "User ID is required"],
        unique: true, // Note: 'unique' is not a validator, just creates a unique index
    },
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        maxlength: [100, "Name cannot be more than 100 characters"],
        default: 'Unknown User', // Set default here for new users
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
// userSchema.index({ _id: 1 }); // _id is indexed by default in MongoDB

// Add pre-save middleware for validation
userSchema.pre('save', function(next) {
    try {
        if (!this.name || this.name.trim().length === 0) {
            this.name = 'Unknown User';
        }
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User





