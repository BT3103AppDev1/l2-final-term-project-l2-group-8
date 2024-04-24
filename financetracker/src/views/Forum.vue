<template>

    <body v-if="user">
        <div>
            <NavBar />
        </div>
        <div id="container">
            <div id="add-a-post">
                <textarea id="name" v-model="post.name" placeholder="Enter your name (optional)"></textarea>
                <hr>
                <textarea id="title" v-model="post.title" placeholder="Enter your title (optional)"></textarea>
                <hr>
                <textarea id="text" v-model="post.text" placeholder="Enter your text"></textarea>
                <button @click="upload">Post</button>
            </div><br>
            <div v-for="(post, index) in posts" :key="index" class="view-posts">
                <p><b>{{ post.title }}</b></p>
                <p>{{ post.name }}</p>
                <p>{{ post.text }}</p>
                <button @click="like(index)" :class="{ liked: post.liked }">👍 {{ post.likes }}</button>
                <button @click="dislike(index)" :class="{ disliked: post.disliked }">👎 {{ post.dislikes }}</button>
            </div>
        </div>
    </body>
</template>

<script>
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from '../firebase.js';
import { ref, onMounted,nextTick  } from 'vue';
import NavBar from "@/components/NavBar.vue";

export default {
    name: 'Forum',
    data() {
        return {
            user: false
        }
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            }
        })
    },
    setup() {
        // A reactive reference for the current post being created or edited.
        const post = ref({
            name: "", 
            title: "",
            text: "", 
            liked: false, 
            disliked: false,
            likes: 0, 
            dislikes: 0, 
            comments: [], 
            showComment: false
        });
        const posts = ref([]);// A reactive array to store posts fetched from the database.

        // Asynchronously loads posts from the database and updates the posts array.
        const loadPosts = async () => {
            const db = getFirestore(firebaseApp);
            const querySnapshot = await getDocs(collection(db, "posts"));
            posts.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        };

        // Fetches posts when the component is mounted and a user is logged in.
        onMounted(() => {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    loadPosts(); // Fetch posts once the user is confirmed
                } else {
                    console.log("No user logged in, cannot fetch posts.");
                }
            });
        });

        // Handles the posting of a new post to the database.
        const upload = async () => {
            if (post.value.text.trim() !== "") {
                const db = getFirestore(firebaseApp);
                const docRef = await addDoc(collection(db, "posts"), {
                    name: post.value.name.trim() || "Anonymous",
                    title: post.value.title.trim() || "No Title",
                    text: post.value.text.trim(),
                    likes: 0,
                    dislikes: 0,
                    comments: [],
                    liked: false,
                    disliked: false
                });
                console.log("Document written with ID: ", docRef.id);
                posts.value.push({ ...post.value, id: docRef.id });
                resetPost();
            }
        };

        // Resets the post form to its initial empty state.
        const resetPost = () => {
            post.value = {
                name: "",
                title: "",
                text: "",
                liked: false,
                disliked: false,
                likes: 0,
                dislikes: 0,
                comments: [],
                showComment: false
            };
        };

        // Updates the like count and status of a post.
        const like = async (index) => {
            const db = getFirestore(firebaseApp);
            const currentPost = posts.value[index];
            const postRef = doc(db, "posts", currentPost.id); // Ensure 'db' is defined and imported correctly

            // Determine new values for likes, dislikes, and status flags
            let newLikes = currentPost.liked ? currentPost.likes - 1 : currentPost.likes + 1;
            let newDislikes = currentPost.disliked ? currentPost.dislikes - 1 : currentPost.dislikes;
            let newLiked = !currentPost.liked;
            let newDisliked = currentPost.disliked ? false : currentPost.disliked;

            // Update local state
            currentPost.likes = newLikes;
            currentPost.dislikes = newDislikes;
            currentPost.liked = newLiked;
            currentPost.disliked = newDisliked;

            // Update Firestore
            try {
                await updateDoc(postRef, {
                    likes: newLikes,
                    dislikes: newDislikes,
                });
            } catch (error) {
                console.error('Error updating post: ', error);
            }
        };

        // Updates the dislike count and status of a post.
        const dislike = async (index) => {
            const db = getFirestore(firebaseApp);
            const currentPost = posts.value[index];
            const postRef = doc(db, "posts", currentPost.id); // Ensure 'db' is defined and imported correctly

            // Determine new values for dislikes, likes, and status flags
            let newDislikes = currentPost.disliked ? currentPost.dislikes - 1 : currentPost.dislikes + 1;
            let newLikes = currentPost.liked ? currentPost.likes - 1 : currentPost.likes;
            let newLiked = currentPost.liked ? false : currentPost.liked;
            let newDisliked = !currentPost.disliked;

            // Update local state
            currentPost.dislikes = newDislikes;
            currentPost.likes = newLikes;
            currentPost.liked = newLiked;
            currentPost.disliked = newDisliked;

            // Update Firestore
            try {
                await updateDoc(postRef, {
                    dislikes: newDislikes,
                    likes: newLikes,
            
                });
            } catch (error) {
                console.error('Error updating post: ', error);
            }
        };



        return { post, posts, upload, like, dislike, resetPost };
    },
    components: {
        NavBar
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
body {
    /* background: linear-gradient(to right top, #008080, #bab86c); */
    background-size:cover;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    margin:-20px;
    height:100%;
}
#container {
    width: 60%;
    background-color: #ffffff77;
    border-radius: 20px;
    margin:30px;
    margin-top: 15vh;
}
#add-a-post {
    margin: 20px;
    background-color: #ffffff;
    text-align: center;
    border-radius: 20px;
    padding: 10px;
}
textarea {
    border: none;
    outline: none;
    background-color: #ffffff;
    resize: none;
    height: 30px;
    width: 98%;
}
#text {
    height: 200px;
}
.view-posts {
    margin: 20px;
    background-color: #ffffff;
    border-radius: 20px;
    display: block;
    padding: 10px;
    
}
button {
    background-color: #dddddd;
    border: none;
    height: 40px;
    width: 80px;
    border-radius: 40px;
    font-size: 15px;
    margin: 0 auto;
}
button:hover {
    background-color: #aaaaaa;
}
p {
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-all;
}
.liked {
    background-color: #bbbbbb;
}
.disliked {
    background-color: #bbbbbb;
}
</style>