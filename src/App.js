import React, { useState, useEffect} from "react";
import './App.css';

import Api from "./Api";


import ChatListItem from "./compenents/ChatListItem";
import Chatintro from "./compenents/Chatintro";
import ChatWindow from "./compenents/ChatWindow";
import NewChat from "./compenents/NewChat";

import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
//import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import Login from "./compenents/Login";





// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

  const [chatlist, setChatList] = useState ([]);

  const [activeChat, setActiveChat] = useState({});
  const [user, setUser] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect (() => {
    if(user !== null) {
      let unsub = Api.onChatList(user.id, setChatList);
      return unsub;

    }

  }, [user]);

  const handleNewChat = () => {
    setShowNewChat(true);


  }

  const handleLoginData = async (u) => {
    console.log(u);
    let newUser = {
      id: u.uid,
      name: u.displayName,
      avatar: u.photoURL
    };

    await Api.addUser(newUser);

    setUser(newUser);
  }

  if (user === null) {
    return (<Login onReceive= {handleLoginData}/>);


  }



return (
    <div className="app-window">
      <div className="sidebar">
        {/* abrir nova conversa, novo chat */}
        <NewChat
        chatlist={chatlist}
        user={user}
        show={showNewChat}
        setShow={setShowNewChat}
        
        />

        <header>
          <img className="header--avatar" src={user.avatar} alt=""/>
          <div className="header--buttons">
            <div className="header--btn">
              <DonutLargeIcon style={{color: 'white'}} />
              </div>
              
              <div onClick={handleNewChat} className="header--btn">
              <ChatIcon style={{color: 'white'}} />
              </div>
              {/* <ExpandCircleDownIcon style={{color: '#919191'}} /> */}
              
              <div className="header--btn">
              <MoreVertIcon style={{color: 'white'}} />
              </div>
              </div>

        </header>

        <div className="search"> {/* campo pesquisar */}
          <div className="search--input">
            <SearchIcon fontSize="small" style={{color: '#333'}} />
            <input type="search" placeholder="Procurar ou começar uma nova conversa"/>
          </div>
        </div>


        <div className="chatlist"> {/* lista de contatos  */}
          {chatlist.map ((item, key) => (
            <ChatListItem
              key={key}
              data={item}
              active={activeChat.chatId === (chatlist[key]).chatId }
              onClick={()=>setActiveChat(chatlist[key])}

            />

            


          ))}
        </div>

      </div>
      <div className="contentarea">
        {activeChat.chatId !== undefined &&
          <ChatWindow
              user={user}
              data={activeChat}
            
            />
        
        }
        {activeChat.chatId === undefined &&

          <Chatintro/>
        
        }

        


      </div>
    </div>

  );
}