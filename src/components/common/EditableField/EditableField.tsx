import React, { useState } from 'react';
//import './EditableField.css';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  fieldName: string;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  elementType?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  inputType?: 'text' | 'textarea';
  className?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  fieldName,
  editingField,
  setEditingField,
  elementType = 'p',
  inputType = 'text',
  className = ''
}) => {
  const handleTextClick = () => {
    setEditingField(fieldName);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingField(fieldName);
  };

  const handleBlur = () => {
    setEditingField(null);
  };

  const renderDisplayElement = () => {
    const content = (
      <>
        {value}
        <button className="edit-button" onClick={handleEditClick}>
          ✏️
        </button>
      </>
    );

    switch (elementType) {
      case 'h1':
        return <h1 className={className}>{content}</h1>;
      case 'h2':
        return <h2 className={className}>{content}</h2>;
      case 'h3':
        return <h3 className={className}>{content}</h3>;
      case 'span':
        return <span className={className}>{content}</span>;
      default:
        return <p className={className}>{content}</p>;
    }
  };

  return (
    <div className="field-container">
      {editingField === fieldName ? (
        inputType === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className={`edit-textarea ${className}`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className={`edit-input ${className}`}
          />
        )
      ) : (
        <div onClick={handleTextClick}>
          {renderDisplayElement()}
        </div>
      )}
    </div>
  );
};

export default EditableField;
