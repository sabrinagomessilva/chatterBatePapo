import React, {useState, useEffect, useRef} from "react";
import EmojiPicker from "emoji-picker-react";
import './ChatWindow.css';

import Api from "../Api";

import MessageItem from "./MessageItem";

import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import { DragHandle, UndoRounded } from "@mui/icons-material";
import { green, red } from "@mui/material/colors";



// eslint-disable-next-line import/no-anonymous-default-export
export default ({user, data}) => {

    const body = useRef();

    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(SpeechRecognition !== UndoRounded) {
        recognition = new SpeechRecognition();
    }

    const [emojiOpen, setEmojiOpen] = useState(false);
    const [text, setText] = useState ('');    // para salvar o texto
    const [listening, setListening] = useState(false);
    const [list, setList] = useState([]);
    const [users, setUsers] = useState([]);


    useEffect(() => {

        setList([]); 
        let unsub= Api.onChatContent(data.chatId, setList, setUsers);
        return unsub;

    }, [data.chatId]);

    // mantendo a barra de rolagem no campo inferior ao lado da ultima mensagem
    useEffect(()=>{
        if(body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;


        }

    }, [list]);

    // ....

    const handleEmojiClick = (emojiData, ev) => {
        // console.log();
        setText( text + emojiData.emoji );
        

        
    }

    const handleOpenEmoji = () => {
        setEmojiOpen(true);


    }

    const handleCloseEmoji = () => {
        setEmojiOpen(false);


    }

    const handleMicClick = () => {

        if(recognition !==null) {

            recognition.onstart = () => {
                setListening(true);
            }
            recognition.onend = () => {
                setListening(false);
            }
            recognition.onresult = (e) => {
                setText(e.results[0][0].transcript);
            }

            recognition.start();

        }
    }

    const handleInputKeyUp = (e) => {
        if(e.keyCode == 13) {
            handleSendClick();

        }


    }

    const handleSendClick = () => {
        if(text !== '') {
            Api.sendMessage(data, user.id, 'text', text, users);
            setText('');
            setEmojiOpen(false);

        }

    }

    

    return (

    <div className="chatWindow">
        <div className="chatWindow--header">

            <div className="chatWindow--headerinfo">
                <img className="chatWindow--avatar" src= {data.image} alt="" />
                <div className="chatWindow--name">{data.title}</div>
            </div>

            <div className="chatWindow--headerbuttons">

                {/* botões da tela principal do chat -*/}
                <div className="chatWindow--btn">
                    <SearchIcon fontSize="medium" style={{color: `#919191`}}/>
                </div>

                {/* botão de arquivo */}
                <div className="chatWindow--btn">
                    <AttachFileIcon  style={{color: `#919191`}}/>
                </div>

                {/* três pontinhos */}
                <div className="chatWindow--btn">
                    <MoreVertIcon style={{color: `#919191`}}/>
                </div>

            </div>



        </div>
        <div ref={body} className="chatWindow--body">
            {list?.map((item, key)=>(
            <MessageItem
                key={key}
                data={item}
                user={user}
            />
            ))}

        </div>

        {/* Aria dos Emojis */}
        <div 
        className="chatWindow--emojiarea"
        style={{height: emojiOpen ? '200px' : '0px' }}       
        >
            <EmojiPicker height={500} width= '100%'  
            onEmojiClick={handleEmojiClick}

            
            searchDisabled
            skinTonesDisabled
            
            
            />
        </div>



        <div className="chatWindow--footer"> 
            {/* campos da parte de digitar mensagem */}

            <div className="chatWindow--pre"> {/* nossos ícones do campo inferior*/}
            
            
                <div 
                className="chatWindow--btn"
                onClick={handleCloseEmoji}
                style={{width: emojiOpen?40:0}}
                
                >
                    <CloseIcon style={{color: `#919191`}}/>
                </div>

                <div 
                
                className="chatWindow--btn"
                onClick={handleOpenEmoji}
                >
                    <InsertEmoticonIcon style={{color: emojiOpen?'#633187':`#919191`}}/>
                </div>

            </div>

            <div className="chatWindow--inputarea">
                <input 
                    className="chatWindow--input" 
                    type="text"
                    placeholder="Digite uma mensagem"
                    value={text}                     // variável com texto dinamico que salva o texto na propria variael
                    onChange={e=>setText(e.target.value)}
                    onKeyUp={handleInputKeyUp}                    
                    
                    />

            </div>

            <div className="chatWindow--pos"> {/* Microfone - se usuario estiver Não esta digitando algo, mostrar botao de Microfone */}

                {text === '' &&
                <div onClick={handleMicClick}
                className="chatWindow--btn">
                        <MicIcon style={{color: listening ? '#633187' : `#919191`}}/>
                    </div>
            
            }
            
            
            {/* se usuario estiver digitando algo mostrar botao de envio */}
                {text !== '' &&
                <div onClick={handleSendClick}
                className="chatWindow--btn">
                    <SendIcon style={{color: `#919191`}}/>
                </div>
            
            }
                

            </div>

        </div>


    </div>
    
    );

    
}

