<template>
    <div class="container pt-3" id="app">

      <LoginForm v-if="!isTable" @logIn="logIn" @logOut="logOut" @register="register"/>

      <div v-else>
        <h1 style="text-align: center; margin-top: 50px"> Todo on REST Api + SPA</h1>
        
        <TodoAdd @createTask="createTask"/>
        
        <TodoTable v-bind:tasks="tasks" v-on:removeTask="removeTask" @completeTask="completeTask" @downloadFile="downloadFile"/>
      </div>
      <PageSwitch v-bind:isTable="isTable" @toForm="toForm" @toTable="toTable"/>
    </div>  
</template>

<script>

import TodoTable from '@/components/TodoTable'
import TodoAdd from '@/components/TodoAdd'
import LoginForm from '@/components/LoginForm'
import PageSwitch from '@/components/PageSwitch'
//import { request } from '@/connection.js'
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {         
      tasks: [
        //{id: 1, name: 'task1', date: 'date1', completed: false},
        //{id: 2, name: 'task2', date: 'date2', completed: false}
      ],
      completed: false,
      loading: false,
      login: '',
      password: '',
      isTable: true,
    }
  },
  components: {
    TodoTable,
    TodoAdd,
    LoginForm,
    PageSwitch
  },
  methods: {
      toForm(){
        this.isTable = false
      },
      toTable(){
        this.isTable = true
      },
      async createTask(task) {
        //const newTask = await request('http://localhost:3000/api/tasks', 'POST', task)
        let formData = new FormData();
          console.log(task)

          formData.append("task-file", task.file);
          formData.append("name", task.name);
          formData.append("date", task.date);

           
          const response = await axios.post( 'http://localhost:3000/api/tasks',
                formData,
                {
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
                
                }
            )

        //const response = await axios.post("http://localhost:3000/api/tasks", task)
        const newTask = response.data

        //console.log(response.data)

       //console.log((await axios.post("http://localhost:3000/api/tasks", task)).data)
        //this.tasks = await request('http://localhost:3000/api/tasks')



        this.tasks.push(newTask)
      },
      async removeTask(id){
        //await axios.delete(`http://localhost:3000/api/tasks/${id}`)
        //await request(`http://localhost:3000/api/tasks/${id}`, 'DELETE')
        await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
          withCredentials: true
        })
        this.tasks = this.tasks.filter(c => c.id !== id)
      },
      async completeTask(id){
        const task = this.tasks.find (c => c.id === id)
        const isCompleted = task.completed
        
        const response = await axios.put(`http://localhost:3000/api/tasks/${id}`, {...task, completed: !isCompleted}, {
          withCredentials: true
        })
        console.log(response)

        task.completed = response.data.completed
      },
      async downloadFile(id, filename){
        console.log('second')
        //const response = await axios.get(`http://localhost:3000/api/tasks/${id}/${filename}`);

        axios.get(`http://localhost:3000/api/tasks/${id}/${filename}`, {
          withCredentials: true
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename); //or any other extension
          document.body.appendChild(link);
          link.click();
        });

        // axios({
        //   url: `http://localhost:3000/api/tasks/${id}/${filename}`, //your url
        //   method: 'GET',
        //   {
        //     responseType: 'blob',
        //     withCredentials: true
        //   } // important
        // }).then((response) => {
        //   const url = window.URL.createObjectURL(new Blob([response.data]));
        //   const link = document.createElement('a');
        //   link.href = url;
        //   link.setAttribute('download', filename); //or any other extension
        //   document.body.appendChild(link);
        //   link.click();
        // });

        //console.log(response)
      },
      async logIn(userInput){
        console.log(userInput)

        //axios.defaults.withCredentials = true;

        const response = await axios.post('http://localhost:3000/api/login', {...userInput}, {
          withCredentials: 'true'
        })

        this.getTasks()

        console.log(response)
        this.isTable = true
      },
      async getTasks(){
        const response = await axios.get("http://localhost:3000/api/tasks", {
          withCredentials: true
        })
        this.tasks = response.data      
      },

      async logOut(login){
        await axios.post("http://localhost:3000/api/logout", {login}, {
          withCredentials: true
        })

        this.tasks = {}
        console.log("--logOut--")
      },
      async register(data){
        const response = await axios.post("http://localhost:3000/api/register", {...data}, {
          withCredentials: true
        })
        if (response.data)
        {
          console.log("--register--")
        } else {
          console.log("--NOT register--")
        }
        
      }
  },
  async mounted() {
      this.loading = true
      //this.tasks = await request('http://localhost:3000/api/tasks', "GET", {
      //    withCredentials: true
      //  })
      
      const response = await axios.get("http://localhost:3000/api/tasks", {
          withCredentials: true
        })
      this.tasks = response.data
      
      //console.log(response.data)
        //.then(response => this.tasks = response.data.tasks)
      //console.log(this.tasks)
      this.loading = false
  }

  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
}
</style>
