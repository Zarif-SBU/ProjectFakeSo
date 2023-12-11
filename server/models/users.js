var mongoose = require('mongoose');

var Schema = mongoose.Schema;

function paddingZeros(n, zero) {
    n = n.toString();
    while (n.length < zero) {
        n = "0" + n;
    }
    return n;
}

var UserSchema= new Schema(
    {
        userName:{type: String, required:true, minLength:1},
        email:{type: String, required: true, minLength:1},
        passwordHash:{type: String, required: true, minLength:1},
        reputation:{type: Number, default: 50},
        signDate:{type: Date, required: true, default: new Date()},
        admin:{type: Boolean, default: false}
    },
    {timestamps: true},
    {
        toObject: { getters: true },
        toJSON: { getters: true },
    }
);

UserSchema
    .virtual('date')
    .get(function () {
    var dateTime = "";

    const currentTime = new Date();
    const qstTime = this.signDate;
    const timeDifference = currentTime - qstTime;

    if (timeDifference < 60000) { // Less than 1 minute
        dateTime += Math.floor(timeDifference / 1000);
        dateTime+= " seconds ago";
        return dateTime;

    } else if (timeDifference < 3600000) { // Less than 1 hour
        dateTime += Math.floor(timeDifference / 60000);
        dateTime+= " minutes ago";
        return dateTime;
    } else if (timeDifference < 86400000) { // Less than 1 day
        dateTime += Math.floor(timeDifference / 3600000);
        dateTime+= " hours ago";
        return dateTime;
    } else {
        // Display the whole <Month><day> at <hh:min>
        const monthName = qstTime.toLocaleString('default', { month: 'short' });
        dateTime = ` ${monthName} ${qstTime.getDate()} at ${paddingZeros(qstTime.getHours(), 2)}:${paddingZeros(qstTime.getMinutes(), 2)}`;
        return dateTime;
    }

});

module.exports = mongoose.model('users', UserSchema);