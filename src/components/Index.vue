<template>
  <div>
    <Carousel></Carousel>
  </div>
</template>

<script>
import Carousel from './templetes/Carousel';
export default {
  name: 'Index',
  components: {
    Carousel
  },
  data () {
    return {
      paperList: []
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
