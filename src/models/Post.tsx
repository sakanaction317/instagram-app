// src/models/Post.tsx

export interface Post {
    id: string;
    caption: string;
    createdAt: Date;
    userId: string;
    likes: string[];
}