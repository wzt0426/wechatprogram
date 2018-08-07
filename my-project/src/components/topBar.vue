<template>
  <div class="topBar">
    <ul v-for="(item, index) in topBar " :key="index" >
      <li @click="selectTopBar(item.url, index)" class="unclick" :class="{ click:changeColor == index}">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
// import {getList} from '@/utils/index.js'
export default {
  data () {
    return {
      articles: '',
      changeColor: -1
    }
  },
  props: ['topBar'],
  methods: {
    get (url, method, index) {
      this.changeColor = index
    },
    selectTopBar (url, index) {
      this.changeColor = index
      this.$emit('chanegTopBar', url)
    }
  }
}
</script>

<style>
  .topBar {
    width: 100%;
    height: 30px;
    background: white;
  }

  ul {
    width: 100%;
    text-align: center;
  }

  li {
    width: 20%;
    float: left;
  }

  .click{
    color: #D33E42;
    font-weight: bold;
  }
</style>