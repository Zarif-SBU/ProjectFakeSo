// Answer Document Schema
var mongoose=require('mongoose');

var Schema = mongoose.Schema;

function paddingZeros(n, zero) {
    n = n.toString();
    while (n.length < zero) {
        n = "0" + n;
    }
    return n;
}

var AnswerSchema= new Schema(
    {
        text:{type: String, required:true, minLength:1},
        ans_by:{type: String, required: true, minLength:1},
        ans_date_time:{type: Date, required: true, default: new Date()},
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
        votes:{type: Number, required: true, default: 0},
        userEmail: {type: String, default: "testcase@test.com"},
        upVoteEmails:[{type: String}],
        downVoteEmails:[{type: String}],
    },
    {
        toObject: { getters: true },
        toJSON: { getters: true },
    }
);

AnswerSchema
    .virtual('date')
    .get(function () {
        var dateTime = "";

        const currentTime = new Date();
        const qstTime = this.ans_date_time;
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


    AnswerSchema
    .virtual("url")
    .get(function(){
        return "posts/answer/"+this._id;
    });

module.exports = mongoose.model('Answers', AnswerSchema);