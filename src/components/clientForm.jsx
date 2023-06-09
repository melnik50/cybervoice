import React from 'react'
import { useState } from 'react'

function ClientForm(props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    
    async function sendForm() {
        try {
            const res = await fetch(`https://clients.trbyte.ru/chatForm.php`, {
                headers: { 'Content-Type': 'application/json' },
                method: "POST",
                body: JSON.stringify(
                    {   
                        name: name, 
                        phone: phone,
                        text: "",
                        hash: props.hash,
                        chat_id: "",
                        type: 'request',
                        is_first: 'false',
                    }
                ),
            });
            const data = await res.json();
            console.log(data);
            if (!res.ok) {
                throw new Error(data);
            }
            props.hideForm(false);
        } catch (e) {
            return e;
        }
    }

    const closeForm = () => {
        props.hideForm(false);
    }

    return (
        <form id="px-client-form">
            <p>Представьтесь</p>
            <label>
                <span>Имя:</span>
                <input name="Имя" type="text" onChange={e => setName(e.target.value)}/>
            </label>
            <label>
                <span>Телефон:</span>
                <input
                    name="phone" 
                    type="phone"
                    onChange={e => setPhone(e.target.value)}
                />
            </label>
            <div className="px-client-form-buttons">
                <div className="px-client-form-save button" onClick={sendForm}>Сохранить</div>
                <div className="px-client-form-close button b-transparent" onClick={closeForm}>Закрыть</div>
            </div>
        </form>
    )
}

export default ClientForm