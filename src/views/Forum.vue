<template>
    <div id="container">
        <div id="add-a-post">
            <input id="name" v-model="post.name" placeholder="Enter your name (optional)"><hr>
            <input id="title" v-model="post.title" placeholder="Enter your title (optional)"><hr>
            <input id="text" v-model="post.text" placeholder="Enter your text"><br>
            <button @click="Post">Post</button>
        </div>
        <div id="view-posts">
            <ul>
                <li v-for="item in posts">{{ item }}</li>
            </ul>
        </div>
        <LogOut/>
    </div>
</template>

<script>
import LogOut from '@/LogOut.vue';
export default {
    name: 'Forum',
    components: {
        LogOut
    },
    data() {
        return {
            post: {
                name: "",
                title: "",
                text: "",
            },
            posts: []            
        }
    },
    methods: {
        Post() {
            if (this.post.text == "") {
                alert("Please input your message!");
                return;
            }
            var message = "";
            if (this.post.title != "") {
                message += this.post.title + "\n";
            }
            if (this.post.name != "") {
                message += "@" + this.post.name + "\n";
            }
            message += this.post.text;
            this.posts.push(message);            
            this.post = {
                name: "",
                title: "",
                text: "",
            }
        }
    }
}
</script>

<style scoped>
#containter {
    text-align: center;
    background-color: #ffffff;
    width: 200px;
    border-radius: 20px;
}
#add-a-post {
    text-align: center;
    background-color: #dddddd;
    width: 160px;
    border-radius: 20px;
}
input {
    border: none;
    outline: none;
    height: 20px;
    width: 160px;
    border-radius: 20px;
    padding: 5px;
}
#text {
    height: 160px;
}
button {
    background-color: #dddddd;
    border: none;
    height: 40px;
    width: 80px;
    border-radius: 40px;
    font-size: 15px;
    margin: 10px 0 0 0;
}
li {
    display: block;
    text-align: center;
    background-color: #dddddd;
    width: 160px;
    border-radius: 20px;
}
</style>