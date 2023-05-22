import React, { useEffect, useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { auth, db } from '../config/firebaseconfig'
import { addDoc, collection } from 'firebase/firestore'
import '../App.css'
import { useNavigate } from 'react-router-dom'

const Create = ({ isloggedIn }) => {
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const blogCollection = collection(db, "blogPost")
    let navigate = useNavigate()
    const createPost = async () => {
        await addDoc(blogCollection, { title, summary, author: { name: auth.currentUser.displayName, id: auth.currentUser.uid } })
        alert("Uploaded")
        navigate("/")
    }
    useEffect(() => {
        if (!isloggedIn) {
            navigate("/login")
        }
    })
    return (

        <div className="ui form" style={{ margin: "2rem" }}>
            <div className="two fields">

                <div className="field">
                    <label htmlFor="title">Title</label>
                    <input type='text' id="title" placeholder='Enter a title' onChange={(e) => { setTitle(e.target.value) }} required />
                </div>
            </div>
            <div className="field">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="9" placeholder='Enter a description' onChange={(e) => { setSummary(e.target.value) }} required></textarea>
            </div>
            {/* <div className="field">
                <label htmlFor="thumbnail-upload">Upload Thumbnail</label>
                <div className="ui action input">
                    <input type="file" id="thumbnail-upload" accept="image/*" onChange={(e) => { setThumbnail(e.target.files[0]) }} required />
                </div>
                <div className='ui mini message'>
                    <p>Accepted file types: JPEG, PNG, GIF</p>
                </div>

            </div> */}
            <button className="ui button" onClick={createPost}>Submit</button>
        </div>

    )
}
export default Create