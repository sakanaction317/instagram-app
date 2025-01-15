// src/pages/OtherProfile.tsx

import { useState, useEffect } from "react";
import "../styles/global.css";
import { Typography, Box, Avatar, Button, Container } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, getDocs, collection, query, where, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { useParams } from "react-router-dom";
import FollowListDialog from "../components/FollowListDialog";

interface UserProfile {
    displayName: string;
    postCount: number;
    followers: string[];
}

const OtherProfile = () => {
    const { userId } = useParams<{ userId: string} >();
    const currentUser = auth.currentUser;
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [openFollowList, setOpenFollowList] = useState<boolean>(false);
    const [followListTitle, setFollowListTitle] = useState<string>("");
    const [followListUsers, setFollowListUsers] = useState<string[]>([]);
    
    useEffect(() => {
        const fetchUserProfile = async() => {
            if (userId) {
                const userDoc = doc(db, 'users', userId);
                const userSnap = await getDoc(userDoc);

                if (userSnap.exists()) {
                    const data = userSnap.data() as UserProfile;
                    const postCountQuery = await getDocs(query(collection(db, 'posts'), where('userId', '==', userId)));
                    data.postCount = postCountQuery.size;
                    setUserProfile(data);
                    if (currentUser && data.followers.includes(currentUser.uid)) {
                        setIsFollowing(true);
                    }
                }
            }
        };

        fetchUserProfile();
    }, [userId, currentUser]);

    const handleFollow = async() => {
        if (!currentUser || !userProfile) return;

        const currentUserRef = doc(db, 'users', currentUser.uid);
        const userDocRef = doc(db, 'users', userId!);

        if (isFollowing) {
            await updateDoc(currentUserRef, {
                following: arrayRemove(userId)
            });
            await updateDoc(userDocRef, {
                followers: arrayRemove(currentUser.uid)
            });
        }else{
            await updateDoc(currentUserRef, {
                following: arrayUnion(userId)
            });
            await updateDoc(userDocRef, {
                followers: arrayUnion(currentUser.uid)
            });
        }

        setIsFollowing(!isFollowing);
    };

    const fetchUsernames = async(userIds: string[]) => {
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

    const handleOpenFollowList = async() => {
        if (userProfile?.followers) {
            const usernames = await fetchUsernames(userProfile.followers);
            setFollowListUsers(usernames);
            setFollowListTitle("フォローリスト");
            setOpenFollowList(true);
        }
    };

    const handleCloseFollowList = () => {
        setOpenFollowList(false);
    };

    return(
        <Container maxWidth="sm" className="profile-container">
            <Box>
                <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                    <AccountCircleIcon fontSize="large"/>
                </Avatar>
                <Typography variant="h4" gutterBottom>Profile</Typography>
                <Typography variant="h6" gutterBottom>ユーザー名：{userProfile?.displayName}</Typography>
                <Typography variant="h6" gutterBottom>投稿{userProfile?.postCount}件</Typography>
                <Typography variant="h6" gutterBottom>フォロワー : {userProfile?.followers?.length ?? 0}</Typography>
                <Button onClick={handleFollow}>
                    { isFollowing ? 'フォロー解除' : 'フォロー' }
                </Button>
                <Button onClick={handleOpenFollowList}>
                    フォローリストを見る
                </Button>
            </Box>
            <FollowListDialog
                open={openFollowList}
                onClose={handleCloseFollowList}
                title={followListTitle}
                users={followListUsers}
                />
        </Container>
    )
};

export default OtherProfile;