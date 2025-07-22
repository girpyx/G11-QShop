import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "User ID is required"],
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        maxlength: [100, "Name cannot be more than 100 characters"],
        default: 'Unknown User',
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    imageUrl: {
        type: String,
        required: [true, "Image URL is required"],
        trim: true,
        default: 'https://via.placeholder.com/150',
    },
    cartItems: {
        type: Map,
        of: {
            quantity: { type: Number, default: 1, min: 1 },
            price: { type: Number, required: true, min: 0 },
            name: { type: String, required: true },
            image: { type: String, default: 'https://via.placeholder.com/50' },
            addedAt: { type: Date, default: Date.now }
        },
        default: new Map(),
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
}, { 
    minimize: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add compound indexes for better performance
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

// Add pre-save middleware for validation and data cleaning
userSchema.pre('save', function(next) {
    try {
        // Clean name
        if (!this.name || this.name.trim().length === 0) {
            this.name = 'Unknown User';
        }
        
        // Clean email
        if (this.email) {
            this.email = this.email.toLowerCase().trim();
        }
        
        // Set lastLogin if not set
        if (!this.lastLogin) {
            this.lastLogin = new Date();
        }
        
        next();
    } catch (err) {
        next(err);
    }
});

// Add instance methods
userSchema.methods.addToCart = function(productId, productData) {
    this.cartItems.set(productId, {
        ...productData,
        addedAt: new Date()
    });
    return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
    this.cartItems.delete(productId);
    return this.save();
};

userSchema.methods.updateCartItemQuantity = function(productId, quantity) {
    const item = this.cartItems.get(productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        this.cartItems.set(productId, item);
        return this.save();
    }
    throw new Error("Product not found in cart");
};
userSchema.methods.clearCart = function() {
    this.cartItems.clear();
    return this.save();
};

// Add static methods
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase().trim(), isActive: true });
};

userSchema.statics.findActiveUsers = function() {
    return this.find({ isActive: true });
};

// Virtual for cart item count
userSchema.virtual('cartItemCount').get(function() {
    return this.cartItems.size;
});

// Virtual for total cart value
userSchema.virtual('cartTotal').get(function() {
    let total = 0;
    this.cartItems.forEach((item) => {
        total += item.price * item.quantity;
    });
    return total;
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;





