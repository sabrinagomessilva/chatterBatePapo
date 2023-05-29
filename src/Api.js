/* eslint-disable import/no-anonymous-default-export */
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
//import { GoogleAuthProvider } from "firebase/auth";
// import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";




import firebaseConfig from './firebaseConfig';




// const firebaseApp = new GoogleAuthProvider.firebase.initializeApp(firebaseConfig);
// const db = firebaseApp.firestore();



 

  const app = firebase.initializeApp(firebaseConfig);
  
  const provider = new GoogleAuthProvider();

  const auth = getAuth();
  
  const db = app.firestore();



export default {

    fbPopup:async () => {
        

        let result = await signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          //const credential = provider.credentialFromResult(result);
          //const token = credential.accessToken;
          // The signed-in user info.
          //const user = result.user;
        
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          return result;
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });

        console.log(result)

        return result;
        
          
    },
    addUser: async (u) => {
      await db.collection('users').doc(u.id).set({
        name: u.name,
        avatar: u.avatar

      }, {merge:true});


    },
    getContactList: async (userId) => {
      let list = [];

      let results = await db.collection('users').get();
      results.forEach(result => {
        let data = result.data();
        if(result.id !== userId) {
          list.push({
            id: result.id,
            name: data.name,
            avatar: data.avatar
          });
        }

      });

      return list;


    },

    addNewChat: async (user, user2) => {
      let newChat = await db.collection('chats').add({
        message: [],
        users: [user.id, user2.id]


      });

      db.collection('users').doc(user.id).update({
        chats: firebase.firestore.FieldValue.arrayUnion({
          chatId: newChat.id,
          title: user2.name,
          image: user2.avatar,
          with: user2.id

        })
      });

      db.collection('users').doc(user2.id).update({
        chats: firebase.firestore.FieldValue.arrayUnion({
          chatId: newChat.id,
          title: user.name,
          image: user.avatar,
          with: user.id

        })
      });


    },     // função que monitora a lista
    onChatList: (userId, setChatList) => {
      return db.collection('users').doc(userId).onSnapshot((doc) => {
        if(doc.exists) {
          let data = doc.data();
          if(data.chats) {
            let chats = [...data.chats];

                // reordenar a lista de mensagens no nova mensagem
            chats.sort ((a,b) => {
              if(a.lastMessageDate === undefined || b.lastMessageDate === undefined) {
                return -1
              }
              if(a.lastMessageDate.seconds < b.lastMessageDate.seconds) {
                return 1;

              } else {
                return -1;
              }

            });
            setChatList(chats);


          }
        }

      });

    }, 
    onChatContent: (chatId, setList, setUsers ) => {
      return db.collection('chats').doc(chatId).onSnapshot((doc)=> {
        if(doc.exists) {
          let data = doc.data();
          setList(data.messages);
          setUsers(data.users);


        }

      }); 

    },
    sendMessage: async (chatData, userId, type, body, users )=> {
        let now = new Date();

      db.collection('chats').doc(chatData.chatId).update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          type: type,
          author: userId,
          body: body,
          date: now


        })


      });

      for(let i in users) {
        let u = await db.collection('users').doc(users[i]).get();
        let uData = u.data();
        if(uData.chats) {
          let chats = [...uData.chats];

          for(let e in chats) {
            if(chats[e].chatId== chatData.chatId){
              chats[e].lastMessage = body;
              chats[e].lastMessageDate = now;


            }

          }

          await db.collection('users').doc(users[i]).update({
            chats: chats

          });
          

        }


      }

    }


};