<template>
    <body>
        <div id="container">
            <div id="add-a-post">
                <textarea id="name" v-model="post.name" placeholder="Enter your name (optional)"></textarea><hr>
                <textarea id="title" v-model="post.title" placeholder="Enter your title (optional)"></textarea><hr>
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
export default {
    name: 'Forum',
    data() {
        return {
            post: {name: "", title: "",text: "", liked: false, disliked: false, likes: 0, dislikes: 0},
            posts: []            
        }
    },
    created() {
        this.posts = JSON.parse(localStorage.getItem('savedData')) || [];
    },
    methods: {
        upload() {
            this.posts.push(this.post);
            localStorage.setItem('savedData', JSON.stringify(this.posts));
            this.post = {name: "", title:"", text:"", liked: false, disliked: false, likes: 0, dislikes: 0};
        },
        like(index) {
            if (!this.posts[index].liked) {
                this.posts[index].likes++;
                this.posts[index].liked = true;
            } else {
                this.posts[index].likes--;
                this.posts[index].liked = false;
            }
            if (this.posts[index].disliked) {
                this.posts[index].dislikes--;
                this.posts[index].disliked = false;
            }
        },
        dislike(index) {
            if (!this.posts[index].disliked) {
                this.posts[index].dislikes++;
                this.posts[index].disliked = true;
            } else {
                this.posts[index].dislikes--;
                this.posts[index].disliked = false;
            }
            if (this.posts[index].liked) {
                this.posts[index].likes--;
                this.posts[index].liked = false;
            }
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
body {
    background: linear-gradient(to right top, #49eded, #95d52d);
    background-size: cover;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    margin: 0;
}
#container {
    margin: 30px;
    width: 60%;
    background-color: #ffffff77;
    border-radius: 20px;
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
    display: inline-block;
    padding: 10px;
    width: 94%;
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