import { useState } from 'react';
import axios from 'axios';
import { API_MONGO } from '../../config/api';

export default function AssignRole({ userId, onAssign }) {
  const [role, setRole] = useState('cliente');

  const handleAssignRole = async () => {
    try {
      console.log('ASSIGN ->', userId, role);
      await axios.put(`${API_MONGO}/users/${userId}/assign-role`, { role });
      onAssign?.();
    } catch (err) {
      console.error('ASSIGN error:', err.response?.data || err.message);
      alert('Error al asignar el rol');
    }
  };

  return (
    <div className="action-buttons" style={{ display: 'inline-flex', gap: 8 }}>
      <select
        className="select-role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="admin">Administrador</option>
        <option value="vendedor">Vendedor</option>
        <option value="cliente">Cliente</option>
      </select>
      <button className="btn btn-assign" onClick={handleAssignRole}>
        <i className="fas fa-user-check" /> Asignar
      </button>
    </div>
  );
}
