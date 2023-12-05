import '../stylesheets/App.css';
import React from 'react';

function paddingZeros(n, zero) {
    n = n.toString();
    while (n.length < zero) {
        n = "0" + n;
    }
    return n;
}

export default class DateTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    render() {
        const qstTime = this.props.qstTime; // Access the qstTime prop
        // Calculate time difference
        const currentTime = new Date();
        const timeDifference = currentTime - qstTime;

        if (timeDifference < 60000) { // Less than 1 minute
            const secondsAgo = Math.floor(timeDifference / 1000);
            return <div>{secondsAgo} seconds ago</div>;
        } else if (timeDifference < 3600000) { // Less than 1 hour
            const minutesAgo = Math.floor(timeDifference / 60000);
            return <div>{minutesAgo} minutes ago</div>;
        } else if (timeDifference < 86400000) { // Less than 1 day
            const hoursAgo = Math.floor(timeDifference / 3600000);
            return <div>{hoursAgo} hours ago</div>;
        } else {
            // Display the whole <Month><day> at <hh:min>
            const monthName = qstTime.toLocaleString('default', { month: 'short' });
            const formattedTime = ` ${monthName} ${qstTime.getDate()} at ${paddingZeros(qstTime.getHours(), 2)}:${paddingZeros(qstTime.getMinutes(), 2)}`;
            return <div>{formattedTime}</div>;
        }
    }
}
