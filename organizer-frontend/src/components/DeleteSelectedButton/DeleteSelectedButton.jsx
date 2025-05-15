import React from "react";

function DeleteSelectedButton({ disabled, onClick, selectedCount }) {
    return (
        <button
            style={{
                padding: '8px 18px',
                background: selectedCount > 0 ? '#e57373' : '#eee',
                color: selectedCount > 0 ? '#fff' : '#888',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                marginLeft: 16
            }}
            disabled={disabled}
            onClick={onClick}
        >Удалить выбранные</button>
    );
}

export default DeleteSelectedButton;
