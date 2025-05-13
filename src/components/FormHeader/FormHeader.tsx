import React, { useState } from 'react';
import EditableField from '../../components/common/EditableField/EditableField';

interface FormHeaderProps {
  title: string;
  description: string;
  onFieldChange: (field: 'title' | 'description', value: string) => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, description, onFieldChange }) => {
  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null);

return (
  <>
    {/* Título */}
    <EditableField
      value={title}
      onChange={(value) => onFieldChange('title', value)}
      fieldName="title"
      editingField={editingField}
//      setEditingField={setEditingField}
      setEditingField={setEditingField as (field: string | null) => void}
      elementType="h2"
      inputType="text"
    />

    {/* Descripción */}
    <EditableField
      value={description}
      onChange={(value) => onFieldChange('description', value)}
      fieldName="description"
      editingField={editingField}
      setEditingField={setEditingField as (field: string | null) => void}
//      setEditingField={setEditingField}
      elementType="p"
      inputType="textarea"
    />
  </>
);
};

export default FormHeader;
