// src/scripts/addPosts.ts

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { faker } from "@faker-js/faker";

initializeApp(firebaseConfig);
const db = getFirestore();

const addRandomPosts = async() => {
    const postsCollection = collection(db, "posts");

    for (let i = 0; i < 30; i++) {
        const post = {
            userId: faker.string.uuid(),
            caption: faker.lorem.sentence(),
            likes: [],
            comments: [],
        };
        
        try {
            await addDoc(postsCollection, post);
        } catch (error) {
            console.error("Error adding post:", error);
        }
    }
};

export { addRandomPosts };

addRandomPosts();