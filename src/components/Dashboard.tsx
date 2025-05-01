import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './Dashboard.css' // Ensure you create this CSS file

export default function Dashboard() {
    const [data, setData] = useState<any[]>([]);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (!error) setData(data);
    };

    const resetForm = () => {
        setUsername('');
        setBio('');
        setEditId(null);
    }

    const addOrUpdateProfile = async () => {
        if (editId) {
            const { error } = await supabase.from('profiles').update({ username, bio }).eq('id', editId);
            if (error) return alert(error.message);
        } else {
            const { error } = await supabase.from('profiles').insert({ username, bio });
            if (error) return alert(error.message);
        }
        resetForm();
        fetchProfiles();
    };

    const deleteProfile = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this profile?')) return;
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) return alert(error.message);
        fetchProfiles();
    };

    const startEdit = (user: any) => {
        setUsername(user.username);
        setBio(user.bio);
        setEditId(user.id);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    }

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <div className='logout-ctn'><button onClick={logout}>Logout</button></div>

            <div className="form">
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    placeholder="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
                <button onClick={addOrUpdateProfile}>
                    {editId ? 'Update' : 'Add'} Profile
                </button>
                {editId && <button onClick={resetForm}>Cancel</button>}
            </div>

            <table>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Bio</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((user: any) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.bio}</td>
                        <td>{new Date(user.created_at).toLocaleString()}</td>
                        <td>
                            <button onClick={() => startEdit(user)}>Edit</button>
                            <button onClick={() => deleteProfile(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}