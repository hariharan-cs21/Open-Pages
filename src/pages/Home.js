import { getDocs, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../config/firebaseconfig'
import { auth } from "../config/firebaseconfig";
import { addDoc, doc, deleteDoc } from 'firebase/firestore'
import { useRef } from 'react';
import { gsap } from 'gsap';


const Home = ({ isloggedIn }) => {
    const buttonRef = useRef(null);
    const containerRef = useRef(null);

    const blogCollection = collection(db, "blogPost")
    const [postArr, setPostArr] = useState([])
    const [likedPostsData, setLikedPostsData] = useState([]);

    useEffect(() => {
        const loadPost = async () => {
            const data = await getDocs(blogCollection);
            setPostArr(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        loadPost();
    }, []);
    useEffect(() => {
        gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
    }, []);

    useEffect(() => {
        const loadLikedPosts = async () => {
            if (isloggedIn) {
                const data = await getDocs(collection(db, "likedPosts"));
                setLikedPostsData(data.docs.map((doc) => doc.data()));
            }
        };
        loadLikedPosts();
    }, [isloggedIn]);



    const likePost = async (postId) => {
        const currentUser = auth.currentUser;
        const uid = currentUser ? currentUser.uid : null;
        const likedPostIndex = likedPostsData.findIndex((likedPost) => likedPost.postId === postId && likedPost.uid === uid);

        if (likedPostIndex !== -1) {
            const likedPost = likedPostsData[likedPostIndex];
            await deleteDoc(doc(db, "likedPosts", likedPost.id));
            setLikedPostsData(prevLikedPostsData => {
                const updatedData = [...prevLikedPostsData.slice(0, likedPostIndex), ...prevLikedPostsData.slice(likedPostIndex + 1)];
                return updatedData;
            });
            setPostArr(prevPostArr => {
                const updatedArr = prevPostArr.map((post) => {
                    if (post.id === postId) {
                        return { ...post, numLikes: post.numLikes - 1 };
                    } else {
                        return post;
                    }
                });
                return updatedArr;
            });
        } else {
            const likedPost = { postId, uid };
            const docRef = await addDoc(collection(db, "likedPosts"), likedPost);
            setLikedPostsData(prevLikedPostsData => {
                const updatedData = [...prevLikedPostsData, { ...likedPost, id: docRef.id }];
                return updatedData;
            });
            setPostArr(prevPostArr => {
                const updatedArr = prevPostArr.map((post) => {
                    if (post.id === postId) {
                        return { ...post, numLikes: post.numLikes + 1 };
                    } else {
                        return post;
                    }
                });
                return updatedArr;
            });
        }
    };

    const isPostLikedByCurrentUser = (postId) => {
        const currentUser = auth.currentUser;
        const uid = currentUser ? currentUser.uid : null;
        return likedPostsData.some((likedPost) => likedPost.postId === postId && likedPost.uid === uid);
    }


    return (
        <div ref={containerRef} className="container" style={{
            marginTop: "2%"
        }}>
            {postArr.map((item) => {
                return (
                    <div className="ui centered cards" key={item.id}><div className="ui card fluid" style={{ marginLeft: "5%", marginRight: "5%", marginTop: "2%" }}><div className="content"><div className="header">{item.title}</div><div className="description">{item.summary}</div></div><div className="extra content">
                        {isloggedIn &&
                            <>
                                <i ref={buttonRef}
                                    className={isPostLikedByCurrentUser(item.id) ? "heart icon red disabled" : "heart icon"}
                                    onClick={() => {
                                        buttonRef.current.disabled = true;
                                        likePost(item.id);
                                    }}
                                ></i>
                                {likedPostsData.filter((likedPost) => likedPost.postId === item.id).length} Likes
                            </>
                        }


                        <div className="right floated author">Posted By:
                            <strong> {item.author?.name}</strong>
                        </div>
                    </div></div></div>
                )
            })
            }
        </div>
    )

}
export default Home