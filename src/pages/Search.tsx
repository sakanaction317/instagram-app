// src/pages/Search.tsx

import React, {useState, useEffect} from "react";
import SearchBar from "../components/SearchBar";
import { Container, Grid2, Card, CardContent, Typography, Button, IconButton } from "@mui/material";
import { collection, doc, getDocs, query, where, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Post } from "../models/Post";
import Comment from "./Comment";
import FavoriteIcon from '@mui/icons-material/Favorite';
import "../styles/global.css";

const Search = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState('');

    const handleSearch = async(searchQuery: string) => {
        setSearchQuery(searchQuery);
        const postsCollection = collection(db, 'posts');
        const querySnapshot = await getDocs(postsCollection);
        const allPosts = querySnapshot.docs.map(doc  => ({ id: doc.id, ...doc.data() })) as Post[];

        const searchResults = allPosts.filter(post => post.caption.toLowerCase().includes(searchQuery.toLowerCase()));
        setPosts(searchResults);

        await fetchUsers();
    };

    const handleLike = async(postId: string) => {
        if (user) {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                likes: arrayUnion(user.uid)
            });
            handleSearch(searchQuery);
        }
    }

    const fetchUsers = async() => {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs. reduce((acc: {[key: string]: any}, doc) => {
            const data = doc.data();
            acc[doc.id] = {id: doc.id, ...data};
            return acc;
        }, {});
        setUsers(usersList);
    }

    return(
        <Container maxWidth="lg">
            <SearchBar onSearch={handleSearch}/>
            <Grid2 container spacing={4} className="grid-container">
                {posts.map((post) => (
                    <Grid2 item key={post.id} xs={12} sm={6} md={4} >
                        <Card>
                            <CardContent className="card-content">
                                <Typography gutterBottom variant="h5" component="div">
                                    {post.caption}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Posted by: {users[post.userId]?.displayName || 'Unknown User'}
                                </Typography>
                                <div style={{ display: 'flex', alignItems: 'left', marginTop: '10px' }}>
                                    <Button onClick={() => handleLike(post.id)}  style={{ color: 'red', marginLeft: '10px' }}>
                                        <FavoriteIcon style={{ marginRight: '5px' }} />
                                        {post.likes ? post.likes.length : 0}
                                    </Button>
                                    <Comment postId={post.id}/>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        </Container>
    );
};

export default Search;