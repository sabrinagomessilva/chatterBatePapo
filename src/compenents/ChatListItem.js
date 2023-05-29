import React, {useState, useEffect} from 'react';
import './ChatListItem.css';




// eslint-disable-next-line import/no-anonymous-default-export
export default ({onClick, active, data}) => {

    const [time, setTime] = useState('');

    useEffect(() => {
        if(data.lastMessageDate > 0) {
            let d = new Date(data.lastMessageDate.seconds * 1000);
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
        
        
        className={`chatListItem ${active?'active':''}`}
        onClick={onClick}
        
        >


            <img className='chatListItem--avatar' src={data.image} referrerPolicy="no-referrer" alt='' />
            <div className='chatListItem--lines'>
                <div className='chatListItem--line'>            
                <div className='chatListItem--name'>{data.title}</div>
                <div className='chatListItem--date'>{time}</div>
            </div>
            <div className='chatListItem--line'>
                <div className='chatListItem--lastMsg'>
                    <p>{data.lastMessage}</p>
                </div>
            </div>
        </div>
        </div>
    );
}