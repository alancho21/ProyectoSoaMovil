import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_MONGO } from '../../config/api';
import UserForm from './UserForm';
import UserList from './UserList';
import './users.css';

export default function UsersModule() {
  const [users, setUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState(null);

  const load = async () => {
    const { data } = await axios.get(`${API_MONGO}/users`);
    console.log('LOAD users ->', data);
    setUsers(data);
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <UserForm
        user={userToEdit}
        onSubmit={async () => { setUserToEdit(null); await load(); }}
        onCancel={() => setUserToEdit(null)}
      />
      <UserList
        users={users}
        setUserToEdit={setUserToEdit}
        onRefresh={load}
      />
    </>
  );
}
