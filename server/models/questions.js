// Question Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

function paddingZeros(n, zero) {
    n = n.toString();
    while (n.length < zero) {
        n = "0" + n;
    }
    return n;
}

var QuestionSchema = new Schema(
    {
        title: { type: String, required: true, maxLength: 100, minLength: 1 },
        text: { type: String, required: true, minLength: 1 },
        tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
        answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
        asked_by: { type: String, required: true, minLength: 1, default: "Anonymous" },
        ask_date_time: { type: Date, required: true, default: new Date() },
        views: { type: Number, default: 0},
    },
    {
        toObject: { getters: true },
        toJSON: { getters: true },
    }
    
);

//converts date time into a correctly formatted version to be used when the questions are displayed
QuestionSchema
    .virtual('date')
    .get(function () {
        var dateTime = "";

        const currentTime = new Date();
        const qstTime = this.ask_date_time;
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

    QuestionSchema
    .virtual("url")
    .get(function(){
        return "posts/question/"+this._id;
    });

module.exports = mongoose.model('Questions', QuestionSchema);