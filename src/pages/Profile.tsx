// src/pages/Profile.tsx

import React, { useState, useEffect, useCallback } from "react";
import { auth, db } from "../firebaseConfig";
import { updatePassword, updateProfile } from "firebase/auth";
import { Container, TextField, Button, Typography, Dialog, DialogTitle, DialogContent, Avatar, Box } from "@mui/material";
import { collection, query, where, doc ,getDocs, getDoc ,updateDoc, setDoc } from "firebase/firestore";
import "../styles/global.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FollowListDialog from "../components/FollowListDialog";


const Profile = () => {
    const [displayName, setDisplayName] = useState<string>(auth.currentUser?.displayName || '');
    const [postCount, setPostCount] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [following, setFollowing] = useState<string[]>([]);
    const [followers, setFollowers] = useState<string[]>([]);
    const [openFollowList, setOpenFollowList] = useState<boolean>(false);
    const [followListTitle, setFollowListTitle] = useState<string>("");
    const [followListUsers, setFollowListUsers] = useState<string[]>([]);

    const fetchPostCount = async(userId: string) => {
        const postCollection = collection(db, "posts");
        const q = query(postCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        setPostCount(querySnapshot.size);
    };

    const fetchFollowData = async(userId: string) => {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const following = userData.following || [];
            const followers = userData.followers || [];
            return { following, followers };
        }
        return { follwing: [], follwers: [] };
    }

/*
    const fetchUserData = useCallback(async(userId: string) => {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setDisplayName(userData.displayName || '');
            fetchPostCount(userId);
            const followData = await fetchFollowData(userId);
            setFollowing(followData.following);
            setFollowers(followData.followers);
        }else{
            console.log("No such document");
            await setDoc(userRef, {
                displayName: auth.currentUser!.displayName,
                email: auth.currentUser!.email
            });
        }
    }, []);
*/

    const fetchUsernames = async(userIds: string[]): Promise<string[]> => {
        const usernames: string[] = [];
        for(const id of userIds) {
            const userDoc = await getDoc(doc(db, 'users', id));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.displayName) {
                    usernames.push(userData.displayName);
                }
            }
        }
            return usernames;
        };

    const fetchUserData = useCallback(async(userId: string) => {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setDisplayName(userData.displayName || '');
            fetchPostCount(userId);
            const followData  =await fetchFollowData(userId);
            setFollowing(followData.following);
            setFollowers(followData.followers);
        }else{
            await setDoc(userRef, {
                displayName: auth.currentUser!.displayName,
            });
        }
    }, []);

useEffect(() => {
    if (auth.currentUser) {
        fetchUserData(auth.currentUser.uid);
    }
}, [fetchUserData]);

const handleUpdate = async(e: React.FormEvent) => {
    e.preventDefault();
    if (auth.currentUser) {
        try {
            await updateProfile(auth.currentUser, { displayName });
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                displayName: displayName
            });

            if (password) {
                await updatePassword(auth.currentUser, password);
            }
            alert("Profile updated successfully");
            console.log('Updated displayName:', auth.currentUser.displayName);
            handleClose();
        } catch (error) {
            console.error("Profile update error: " , error);
            alert("Failed to update profile")
        }
    }
};

const handleOpen = () => {
    setOpen(true)
};

const handleClose = () => {
    setDisplayName(auth.currentUser?. displayName || '');
    setPassword('');
    setOpen(false)
};

const handleOpenFollowList = async(title: string, userIds: string[]) => {
    const usernames = await fetchUsernames(userIds);
    setFollowListTitle(title);
    setFollowListUsers(usernames);
    setOpenFollowList(true);
};

const handleCloseFollowList = () => {
    setOpenFollowList(false);
};

return (
    <Container maxWidth="sm" className="profile-container">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={5}>
            <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                <AccountCircleIcon fontSize="large"/>
            </Avatar>
            <Typography variant="h4" gutterBottom>Profile</Typography>
            <Typography variant="h6" gutterBottom>ユーザー名： {displayName}</Typography>
            <Typography variant="h6" gutterBottom>
                <PostAddIcon fontSize="small"/>投稿{postCount}件
            </Typography>
            <Typography>
                フォロー： {following.length}
                <Button 
                    onClick={() => handleOpenFollowList("Following", following)}
                    variant="outlined"
                    sx={{
                        borderColor: 'gray',
                        color: 'gray',
                        padding: '1px',
                        marginLeft: '10px',
                        '&:hover': {
                            borderColor: 'black',
                            Color: 'black',
                            backgroundColor: 'black',
                        }
                    }}
                    >見る
                </Button>
            </Typography>
            <Typography>
                フォロワー： {followers.length}
                <Button 
                    onClick={() => handleOpenFollowList("Followers", followers)}
                    variant="outlined"
                    sx = {{
                        borderColor: 'gray',
                        padding: '1px',
                        color: 'gray',
                        marginLeft: '10px',
                        marginTop: '5px',
                        marginBottom: '5px',
                        '&:hover':{
                            borderColor: 'black',
                            color: 'black',
                            backgroundColor: 'black',
                        }
                    }}
                        >見る
                </Button>
            </Typography>
            <Button onClick={handleOpen} variant="contained" color="primary">
                プロフィールを編集
            </Button>
        </Box>

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>プロフィールを編集</DialogTitle>
            <DialogContent>
                <TextField 
                    label="ユーザー名"
                    value={displayName}
                    fullWidth
                    onChange={(e) => setDisplayName(e.target.value)}
                    margin="normal"
                />
                <TextField 
                    label="新しいパスワード"
                    value={password}
                    fullWidth
                    onChange={(e) =>setPassword(e.target.value) }
                    margin="normal"
                />
            </DialogContent>
            <DialogContent>
                <Button onClick={handleClose} color="primary">
                    キャンセル
                </Button>
                <Button onClick={handleUpdate} color="primary">
                    更新
                </Button>
            </DialogContent>
        </Dialog>

        <FollowListDialog
            open={openFollowList}
            onClose={handleCloseFollowList}
            title={followListTitle}
            users={followListUsers}
        />
    </Container>
);
};

export default Profile;