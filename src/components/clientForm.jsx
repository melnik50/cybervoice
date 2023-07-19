import React from 'react'
import { useState } from 'react'

function ClientForm(props) {
    const closeForm = () => {
        props.hideForm();
    }

    return (
        <form id="px-client-form">
            <p>Представьтесь</p>
            <label>
                <span>Имя:</span>
                <input name="Имя" type="text" onChange={e => props.setName(e.target.value)}/>
            </label>
            <label>
                <span>Телефон:</span>
                <input
                    name="phone" 
                    type="phone"
                    onChange={e => props.setPhone(e.target.value)}
                />
            </label>
            <div className="px-client-form-buttons">
                <div className="px-client-form-save button" onClick={closeForm}>Сохранить</div>
                <div className="px-client-form-close button b-transparent" onClick={closeForm}>Закрыть</div>
            </div>
        </form>
    )
}

export default ClientForm