<template>
    <div class="btn-group" role="group" aria-label="Basic example" style="margin-top:40px; margin-bottom:20px">
        <button type="button" class="btn btn-secondary" v-bind:class="[!isTable ? 'active' : '']" @click="toForm">Login form</button>
        <button type="button" class="btn btn-secondary" v-bind:class="[isTable ? 'active' : '']" @click="toTable">Todos</button>
    </div>
</template>

<script>
export default {
    props: ['isTable'],
    methods: {
        toForm(){
            this.$emit('toForm')
        },
        toTable(){
            this.$emit('toTable')
        }
    }
}
</script>