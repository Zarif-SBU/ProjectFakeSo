var UserSchema= new Schema(
    {
        userName:{type: String, required:true, minLength:1},
        email:{type: String, required: true, minLength:1},
        password:{type: String, required: true, minLength:1, format: "email"},
    },
    {
        toObject: { getters: true },
        toJSON: { getters: true },
    }
);
module.exports = mongoose.model('users', UserSchema);