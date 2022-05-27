<template>
  <div>
    <div class="slider-box">
      <el-carousel indicator-position="outside" height="600px" :interval="3000">
        <el-carousel-item v-for="item in list" :key="item">
          <img :src="item" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <h2 style="text-align: center;margin-top: 60px">An AI Credibility Analysis and Demonstration System</h2>
    <div class="button">
      <el-button type="primary" @click="goAttack">Visual Attack Demo</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [
        'https://s3.bmp.ovh/imgs/2022/05/27/3d684575e9695446.png',
        'https://s3.bmp.ovh/imgs/2022/05/22/671dfbf8d8f1531c.png',
        'https://s3.bmp.ovh/imgs/2022/05/22/2cab5f07b41e5547.png'
      ]
    };
  },
  methods: {
    goAttack () {
      this.$router.push('/cv-attack');
    }
  }
};
</script>

<style scoped lang="less">
  .slider-box {
    width: 80%;
    margin: 100px auto 0;
    height: 600px;
    border-radius: 20px;
    border: 2px solid black;
    .el-carousel__item {
      display: flex;
      align-items: center;
      img {
        width: 100%;
      }
    }
  }
  .button {
    display: flex;
    justify-content: center;
  }
  .el-button--primary {
    height: 50px;
    width: 200px;
    border-radius: 25px;
    margin-top: 20px;
    background-color: #000 !important;
    border: 0px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 16px;
  }
  /*鼠标经过*/
  .el-button--primary:hover {
    background-color: rgba(39,40,44,.7) !important;
  }
  /*鼠标按下*/
  .el-button--primary:focus {
    background-color: #000 !important;
  }
</style>
