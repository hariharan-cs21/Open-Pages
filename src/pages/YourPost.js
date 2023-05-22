import React, { useEffect, useState } from 'react'
import { getDocs, collection, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { db, auth } from '../config/firebaseconfig'
import { useNavigate } from 'react-router-dom'

const YourPost = ({ isloggedIn }) => {
    const blogCollection = collection(db, "blogPost")
    const [postArr, setPostArr] = useState([])
    const [editPost, setEditPost] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    let navig = useNavigate()

    useEffect(() => {
        const loadPost = async () => {
            const data = await getDocs(blogCollection);
            setPostArr(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        loadPost();
    }, []);

    const delPost = async (id) => {
        const docRef = doc(db, "blogPost", id)
        await deleteDoc(docRef)
        alert("Post deleted")
        navig("/")
    }

    const handleEditOpen = (post) => {
        setEditPost(post)
        setIsEditOpen(true)
    }

    const handleEditClose = () => {
        setEditPost(null)
        setIsEditOpen(false)
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        const docRef = doc(db, "blogPost", editPost.id)
        await setDoc(docRef, editPost)
        alert("Post edited")
        setEditPost(null)
        setIsEditOpen(false)
    }

    return (
        <div className='container'>
            {postArr.map((item) => {
                return (
                    <div className='title' key={item.id} style={{ margin: "5px" }}>
                        {item.author?.id === auth.currentUser?.uid &&
                            <h4>{item.title}</h4>}
                        {isloggedIn && (item.author?.id === auth.currentUser?.uid) &&
                            <>
                                <button className='ui primary button' onClick={() => { handleEditOpen(item) }}>Edit</button>
                            </>
                        }
                        {isloggedIn && (item.author?.id === auth.currentUser?.uid) &&
                            <button className='ui black button' onClick={() => { delPost(item.id) }}>delete</button>
                        }

                        {isEditOpen && editPost?.id === item.id &&
                            <div className="ui form" style={{ margin: "2rem" }}>
                                <div className="two fields">
                                    <form onSubmit={handleEditSubmit}>

                                        <div className="field">
                                            <label htmlFor="title">Title</label>
                                            <input type="text" value={editPost.title} onChange={(e) => { setEditPost({ ...editPost, title: e.target.value }) }} /></div>
                                        <div className="field">
                                            <label htmlFor="description">Description</label>
                                            <textarea type="text " rows="9" value={editPost.summary} onChange={(e) => { setEditPost({ ...editPost, summary: e.target.value }) }} />
                                        </div>
                                        <button type="submit" className='ui button'>Save</button>
                                        <button type="button" className='ui button' onClick={handleEditClose}>Cancel</button>
                                    </form>
                                </div>
                            </div>
                        }
                    </div>

                )
            })
            }
        </div>
    )
}
export default YourPost
