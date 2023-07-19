
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Widget, addResponseMessage, renderCustomComponent } from 'react-chat-widget-2';
import ClientForm from "./components/clientForm";
import "react-chat-widget-2/lib/styles.css";

function App() {
  const ws = useRef(null);
  const hash = useRef(null);
  const chatId = useRef("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isNewMessage, setNewMessage] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [isFormActive, setFormIsActive] = useState(true);

  useEffect(() => {
    if(!ws.current)  {
      ws.current = new WebSocket("wss://chattrbyte.ru:27900/");
    }

    gettingData();
    changeTimestamps();

    return () =>  {
      window.addEventListener('beforeunload', function (event) {
        ws.current.close();
      })
    }
  }, [ws, isFirst, isNewMessage]);

  const changeTimestamps = useCallback(() => {
    //Изменить время, иначе прилетает в формате AM/PM
    let timestamps = document.querySelectorAll(".rcw-timestamp");
    let date = new Date();
    let hours = date.getHours();
    for(let timestamp of timestamps) {
      let timestampSplitted = timestamp.textContent.split(":");
      if(hours >= 12) {
        timestamp.textContent = hours + ":" + timestampSplitted[1];
      }
    }
  }, [isNewMessage]);

  const hideForm = () => {
    setFormIsActive(false);
  }

  const gettingData = useCallback(() => {
    if (!ws.current) return;
    ws.current.onmessage = e => { 
      const message = JSON.parse(e.data);

      if(message["type"] === "reply") {
        addResponseMessage(message["text"]);
      } else {
        chatId.current = message["chat_id"];
        hash.current = message["hash"];
        if(isFirst) {
          renderCustomComponent(ClientForm, {hash: hash.current, chat_id: chatId.current, setName: setName, setPhone: setPhone, hideForm: hideForm});
        }
      }

      setNewMessage(!isNewMessage);
    };
  }, [isNewMessage, isFirst]);

  const handleNewUserMessage = (newMessage) => {
    let messages = new Map();

    messages.set('text', newMessage);
    messages.set('hash', hash.current);
    messages.set('chat_id', chatId.current);
    messages.set('type', 'request');
    messages.set('is_first', 'false');
    messages.set('name', '');
    messages.set('phone', '');

    if(isFirst) {
      setIsFirst(false);
      messages.set('is_first', 'true');
      messages.set('name', name);
      messages.set('phone', phone);
    }

    ws.current.send(JSON.stringify(Object.fromEntries(messages)));
    
    setNewMessage(!isNewMessage);
  };

  return (
    <div className={!isFormActive ? 'pixora-chat px-hide': 'pixora-chat'}>
      {<Widget
        title = "Все для стройки ПРОТЭК!"
        senderPlaceHolder = "Введите свое сообщение и нажмите Enter"
        subtitle = "Онлайн"
        handleNewUserMessage={handleNewUserMessage}
      />}
    </div>
  );
}

export default App;