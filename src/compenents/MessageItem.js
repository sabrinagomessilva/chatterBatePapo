import React, {useState, useEffect} from "react";
import './ChatListItem.css'
import './MessageItem.css'


// eslint-disable-next-line import/no-anonymous-default-export
export default ({data, user}) => {

    const [time, setTime] = useState('');

    useEffect(() => {
        if(data.date > 0) {
            let d = new Date(data.date.seconds * 1000);
            let hours = d.getHours();
            let minutes = d.getMinutes();
            // let seconds = d.getSeconds();
            hours = hours < 10 ? '0' +hours : hours;
            minutes = minutes < 10 ? '0' +minutes : minutes;
            // seconds = seconds < 10 ? '0' +seconds : seconds;
            setTime(`${hours}:${minutes} `);

        }


    }, [data]);


    return (
        <div 
            
            className="messageLine"
            style={{
                justifyContent: user.id === data.author ? 'flex-end' : 'flex-start'
            
            }}
            
        >
            <div 
                className="messageItem"
                style={{
                    backgroundColor:user.id === data.author ? '#C0C0C0' : '#fff'
                }}
            >
                <div className="messageText">{data.body}</div> {/* mensagem */}
                <div className="messageDate">{time}</div>
            </div>
        </div>
    );
}