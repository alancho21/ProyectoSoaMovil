import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_MONGO } from '../../config/api';

export default function UserForm({ user, onSubmit, onCancel }) {
  const userId = user?._id || user?.id;          // <- acepta _id o id
  const isEditing = Boolean(userId);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'cliente'); // admin|vendedor|cliente

  useEffect(() => {
    console.log('FORM got user ->', user);
    setName(user?.name || '');
    setEmail(user?.email || '');
    setRole(user?.role || 'cliente');
    setPassword('');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        console.log('UPDATE ->', userId, { name, email, role });
        await axios.put(`${API_MONGO}/users/${userId}`, { name, email, role });
      } else {
        console.log('CREATE ->', { name, email, password, role });
        await axios.post(`${API_MONGO}/users`, { name, email, password, role });
      }
      onSubmit?.();
    } catch (err) {
      console.error('Error al guardar', err.response?.data || err.message);
      alert('Error al guardar usuario');
    }
  };

  return (
    <div>
      <h2>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre" required />
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo" required />
        {!isEditing && (
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" required />
        )}
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="cliente">Cliente</option>
          <option value="vendedor">Vendedor</option>
          <option value="admin">Administrador</option>
        </select>
        <div style={{ display:'flex', gap:8, marginTop:8 }}>
          <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
          {isEditing && <button type="button" onClick={onCancel}>Cancelar</button>}
        </div>
      </form>
    </div>
  );
}
