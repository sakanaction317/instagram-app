// src/pages/Comment.tsx

import React, {useState} from "react";
import { TextField, Button, IconButton, List, ListItem, Dialog, DialogTitle, ListItemText, Grid2 } from "@mui/material";
import { db } from "../firebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import CommentIcon from '@mui/icons-material/Comment';
import { data } from "react-router-dom";
import "../styles/global.css";

const Comment = ({ postId }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [open, setOpen] = useState(false);

    const handleCommentSubmit = async(e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "comments"),{
                postId: postId,
                text: comment,
                createdAt: new Date(),
            });
            setComment("");
            fetchComments(); //コメントを送信した後にコメント一覧を表示
        } catch (error) {
            console.error("Error adding comment: " , error);
        }
    };

    const fetchComments = async() => {
        const q = query(collection(db, "comments"), where('postId', '==', postId));
        const querySnapshot = await getDocs(q);
        const fetchedComments = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {id: doc.id, ...data, createdAt: data.createdAt.toDate()};
        });
        setComments(fetchedComments);
    }

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleOpen = () => {
        setOpen(true);
        fetchComments(); 
    };

    const handleClose = () => {
        setOpen(false);
    }

    return(
        <div>
            <IconButton onClick={handleOpen}>
                <CommentIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>コメントを追加</DialogTitle>
                <TextField 
                    label="コメントを追加"
                    value={comment}
                    fullWidth
                    onChange={handleCommentChange}
                    style={{ marginBottom: '10px', maxWidth: '800px', margin: 'auto' }}
                />
                <Button onClick={handleCommentSubmit} variant="contained" color="primary" sx={{ width: '100px', height: '40px', margin: 'auto', display: 'block', marginTop: '10px' }}>
                    送信
                </Button>
                <DialogTitle>コメント一覧</DialogTitle>
                <Grid2 container spacing={2} className="comment-grid">
                    {comments.map((comment) => (
                        <ListItem key={comment.id}>
                            <ListItemText primary={<span className="comment-text">{comment.text}</span>} secondary={comment.createdAt.toLocaleString()}/>
                        </ListItem>
                    ))}
                </Grid2>
            </Dialog>
        </div>
        
    );
};

export default Comment;