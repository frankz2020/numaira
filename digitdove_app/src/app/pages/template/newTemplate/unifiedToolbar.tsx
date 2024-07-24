import React from 'react';
import ReactQuill from 'react-quill';

interface UnifiedToolbarProps {
  editor: ReactQuill | null;
}

const UnifiedToolbar: React.FC<UnifiedToolbarProps> = ({ editor }) => {
  const handleFormat = (format: string, value: any) => {
    if (editor) {
      editor.getEditor().format(format, value);
    }
  };

  return (
    <div id="toolbar" style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
      <select onChange={(e) => handleFormat('header', e.target.value)}>
        <option value="">Normal</option>
        <option value="1">Header 1</option>
        <option value="2">Header 2</option>
      </select>
      <select onChange={(e) => handleFormat('font', e.target.value)}>
        <option value="">Default</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>
      <select onChange={(e) => handleFormat('size', e.target.value)}>
        <option value="small">Small</option>
        <option value="">Normal</option>
        <option value="large">Large</option>
        <option value="huge">Huge</option>
      </select>
      <button onClick={() => handleFormat('bold', true)}>Bold</button>
      <button onClick={() => handleFormat('italic', true)}>Italic</button>
      <button onClick={() => handleFormat('underline', true)}>Underline</button>
      <button onClick={() => handleFormat('strike', true)}>Strike</button>
      <button onClick={() => handleFormat('blockquote', true)}>Blockquote</button>
      <button onClick={() => handleFormat('list', 'ordered')}>Ordered List</button>
      <button onClick={() => handleFormat('list', 'bullet')}>Bullet List</button>
      <button onClick={() => handleFormat('indent', '-1')}>Outdent</button>
      <button onClick={() => handleFormat('indent', '+1')}>Indent</button>
      <button onClick={() => handleFormat('clean', true)}>Clean</button>
    </div>
  );
};

export default UnifiedToolbar;
