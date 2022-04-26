<template>
    <div style="width: 40%; margin: 0 auto">
        <form>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Login</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="login">
                <div id="emailHelp" class="form-text">We'll never share your email or login with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" v-model="password">
            </div>
            <!-- <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div> -->
            <div style="display: flex; justify-content: space-between;">
                <button type="button" class="btn btn-success" @click="logIn">Log In</button>
                <button type="button" class="btn btn-primary" @click="register">Register</button>
                <button type="button" class="btn btn-danger" @click="logOut" >Log Out</button>
            </div>
        </form>

    </div>
</template>

<script>
export default {
    data() {
        return {
            login: '',
            password: ''
        }
    },
    methods: {
        logIn(){
            const userInput = {
                login: this.login,
                password: this.password
            }            
            this.$emit('logIn', userInput)
        },
        register(){
            const userInput = {
                login: this.login,
                password: this.password
            }            
            this.$emit('register', userInput)
        },
        logOut(){
            this.$emit('logOut', this.login)
        }
    }
}
</script>