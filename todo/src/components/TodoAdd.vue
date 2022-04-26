<template>
    <form class="row row-cols-lg-auto g-3 align-items-center"   @submit.prevent="createTask">
        <div class="col-12">
            <input type="text" class="form-control" placeholder="Task" id="name" v-model="name">
        </div>
        <div class="col-12">
            <input type="datetime-local" class="form-control" id="date" v-model="date">
        </div>
        <div class="col-12">
            <input type="file" class="form-control" id="formFile" ref="file" v-on:change="handleFileUpload()">      
        </div>
        <div class="col-12">
            <button class="btn btn-primary" type="submit" >Add</button>    
        </div>
        
  </form>
</template>

<script>
export default {
    data(){
        return {
            name: '',
            date: '',
            file: null
        }
    },
    methods: {
        createTask(){
           const newTask = {
               name: this.name, 
               date: this.date, 
               file: this.file
               }
            this.$emit('createTask', newTask)
            this.name = ''
            this.date = ''
            this.file = null
        },
        handleFileUpload(){
            this.file = this.$refs.file.files[0];
            console.log(this.file)
        }
    }
}
</script>