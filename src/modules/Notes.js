import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { listTodos as listNotes } from '../graphql/queries';
import { createTodo as createNoteMutation, deleteTodo as deleteNoteMutation } from '../graphql/mutations';

const initialFormState = { name: '', description: '' }

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {

        const fetchNotes =async () => {
            try {
              
              const apiData = await API.graphql(graphqlOperation(listNotes));
              
              const notesFromAPI = apiData.data.listTodos.items;
                await Promise.all(notesFromAPI.map(async note => {
                    if (note.image) {
                    const image = await Storage.get(note.image);
                    note.image = image;
                    }
                    return note;
                }));
              console.log(apiData.data.listTodos.items);
              setNotes(apiData.data.listTodos.items);
            
            } catch (e) {
              
              console.log(e);
            
            }
          }

        fetchNotes();
        
    }, []);

    async function createNote() {
        if (!formData.name || !formData.description) return;
        await API.graphql({ query: createNoteMutation, variables: { input: formData } });
        setNotes([ ...notes, formData ]);
        setFormData(initialFormState);
    }

    async function deleteNote({ id }) {
        const newNotesArray = notes.filter(note => note.id !== id);
        setNotes(newNotesArray);
        await API.graphql(graphqlOperation(deleteNoteMutation, { input: { id: id }}));
    }

    async function onChange(e) {
        if (!e.target.files[0]) return
        const file = e.target.files[0];
        setFormData({ ...formData, image:file.name });
        await Storage.put(file.name, file);
        //fetchNotes();
    }
    
    return (
        <div>
            <h1>My Notes App</h1>
            <input
                onChange={e => setFormData({ ...formData, 'name': e.target.value})}
                placeholder="Note name"
                value={formData.name}
            />
            <input
                onChange={e => setFormData({ ...formData, 'description': e.target.value})}
                placeholder="Note description"
                value={formData.description}
            />
            <input
                type="file"
                onChange={onChange}
            />
            <button onClick={createNote}>Create Note</button>
            <div style={{marginBottom: 30}}>
                {
                notes.map(note => (
                    <div key={note.id || note.name}>
                        <h2>{note.name}</h2>
                        <p>{note.description}</p>
                        <button onClick={() => deleteNote(note)}>Delete note</button>
                        {
                            note.image && <img src={note.image} style={{width: 400}} />
                        }
                    </div>
                ))
                }
            </div>
        </div>
    );
};

export default Notes;