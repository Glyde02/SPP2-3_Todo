<template>
<div id="table">
        <table class="table table-bordered" style="margin: 40px auto">
            <thead>
                <tr class="d-flex">
                    <th scope="col" class="col-1">#</th>
                    <th scope="col" class="col-4">Task</th>
                    <th scope="col" class="col-3">Date</th>
                    <th scope="col" class="col-2">File</th>
                    <th scope="col" class="col-1">Complete</th>
                    <th scope="col" class="col-1">Delete</th>
                </tr>
            </thead>

        

        <tbody>
            <TodoItem v-for="(task, i) in tasks" :key="task.id" v-bind:index="i" v-bind:task ="task" @removeTask="removeTask" @completeTask="completeTask" @downloadFile="downloadFile"/>

            
        </tbody> 
        </table>
        
</div>
</template>

<script>
import TodoItem  from '@/components/TodoItem'
export default {
  props: ['tasks'],
  components: {
    TodoItem
  },
  methods: {
      removeTask(id){
        this.$emit('removeTask', id)
      },
      completeTask(id){
          this.$emit('completeTask', id)
      },
      downloadFile(id, filename){
          console.log('start')
          this.$emit('downloadFile', id, filename)
      }
    
  }
}
</script>   

<style>
#table{
    text-align: center;
}
</style>