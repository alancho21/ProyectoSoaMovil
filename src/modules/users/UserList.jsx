import axios from 'axios';
import { API_MONGO } from '../../config/api';
import AssignRole from './AssignRole';

export default function UserList({ users, setUserToEdit, onRefresh }) {
  const handleDelete = async (id) => {
    try {
      console.log('DELETE id:', id, 'URL:', `${API_MONGO}/users/${id}`);
      await axios.delete(`${API_MONGO}/users/${id}`);
      await onRefresh?.();
    } catch (err) {
      console.error('DELETE error:', err.response?.status, err.response?.data || err.message);
      alert('Error al eliminar el usuario');
    }
  };

  return (
    <div>
      <h3>Lista de Usuarios</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const uid = u._id || u.id;
            return (
              <tr key={uid}>
                {console.log('ROW ->', u)}
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-edit"
                      onClick={() => { console.log('EDIT user ->', u); setUserToEdit(u); }}
                    >
                      <i className="fas fa-edit" /> Edit
                    </button>

                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(uid)}
                    >
                      <i className="fas fa-trash-alt" /> Delete
                    </button>

                    <AssignRole userId={uid} onAssign={onRefresh} />
                  </div>
                </td>
              </tr>
            );
          })}
          {!users.length && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>Sin usuarios</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
