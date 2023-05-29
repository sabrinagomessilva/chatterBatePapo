import React, {useState, useEffect} from 'react';
import './NewChat.css';

import Api from '../Api';

import ReplyAllIcon from '@mui/icons-material/ReplyAll';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({user, chatlist, show, setShow}) => {

    const [list, setList] = useState([]);

    useEffect (() =>{

        const getList = async () => {
            if(user !== null) {
                let results = await Api.getContactList(user.id);
                setList(results);
            }

        }
        getList ();

    }, [user]);

    const addNewChat = async (user2) => {
        await Api.addNewChat(user, user2);

        handleClose();


    }

    const handleClose = () => {
        setShow(false);

    }


    return (
        // cabeçalho Nova Conversa Botão de voltar
        <div className='newChat' style={{left: show?0:-415}} >
            <div className='newChat--head'>
                <div onClick={handleClose} className='newChat--backbutton'> 
                    <ReplyAllIcon style={{color: 'white'}}/>

                </div>
                <div className='newChat--headtitle'>Nova Conversa</div>

            </div>
            <div className='newChat--list'>
                {/* lista dos contatos no Nova conversa */}
                {list.map((item, key)=>(
                    <div onClick={() => addNewChat(item)} className='newChat--item' key={key}>
                        <img className='newChat--itemavatar' src={item.avatar} alt=''/>
                        <div className='newChat--itemname'>{item.name}</div>


                    </div>

                ))}

            </div>
            
        </div>
    );
}


