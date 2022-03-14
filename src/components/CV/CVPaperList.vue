<template>
  <div>
    <Paper :base_url="url"></Paper>
  </div>
</template>

<script>  
import Paper from '../templetes/PaperList.vue';

export default {
  name: 'CVPapers',
  components: {
    Paper
  },
  data () {
    return {
      url: '/cv'
    };
  },
  created () {
  },
  methods: {
  }
};
</script>

<style scoped>

</style>
