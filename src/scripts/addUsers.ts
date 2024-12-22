//  src/scripts/addUsers.ts

import { getFirestore, collection, addDoc } from "firebase/firestore";
import  { firebaseConfig } from "../firebaseConfig";
import { faker } from "@faker-js/faker";
import { initializeApp } from "firebase/app";


initializeApp(firebaseConfig);
const db = getFirestore();

const addRandomUsers = async() => {
    const usersCollection = collection(db, 'users');

    for (let i = 0; i < 30; i++) { //ユーザーを30人追加 
        const user = {
            displayName: faker.person.fullName(),
            email: faker.internet.email(),
        };

        try {
            await addDoc(usersCollection, user);
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };
};

export { addRandomUsers };

addRandomUsers();