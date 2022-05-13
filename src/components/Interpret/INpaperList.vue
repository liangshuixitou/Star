<template>
  <div>
    <Paper :base_url="url"></Paper>
  </div>
</template>

<script>
import Paper from '../templetes/PaperList.vue';

export default {
  name: 'NLPPapers',
  components: {
    Paper
  },
  data () {
    return {
      url: '/interpret'
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
