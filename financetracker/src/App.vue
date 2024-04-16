<template>
    <nav>
        <router-link to="/">LogIn</router-link>|
        <router-link to="/register">Register</router-link>|
        <router-link to="/forum">Forum</router-link>
    </nav>
    <router-view/>
</template>

<script setup>

</script>

<style>
#app {
font-family: Avenir, Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-align: center;
color: #2c3e50;
margin-top: 60px;
}
</style>