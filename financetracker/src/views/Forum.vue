<template>
    <body>
        <div id="container">
            <div id="add-a-post">
                <textarea id="name" v-model="post.name" placeholder="Enter your name (optional)"></textarea><hr>
                <textarea id="title" v-model="post.title" placeholder="Enter your title (optional)"></textarea><hr>
                <textarea id="text" v-model="post.text" placeholder="Enter your text"></textarea>
                <button @click="upload">Post</button>
            </div><br>
            <div v-for="post in posts" class="view-posts">
                <p><b>{{ post.title }}</b></p>
                <p>{{ post.name }}</p>
                <p>{{ post.text }}</p>
            </div>
        </div>
    </body>
</template>

<script>
export default {
    name: 'Forum',
    data() {
        return {
            post: {name: "", title: "",text: ""},
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
            this.post = {name: "", title:"", text:""};
        }
    }
}
</script>

<style scoped>
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
</style>