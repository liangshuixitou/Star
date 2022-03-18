<template>
  <el-container class="home-container">
    <el-aside :width="isCollapsed ? '64px' : '240px'">
      <div class="toggle-button" @click="toggleCollapse">
        |||
      </div>
      <el-menu
        :default-active="activePath"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#fff"
        unique-opened
        :router="true"
        :collapse=isCollapsed
        :collapse-transition="false"
        @select="handleSelect"
        active-text-color="#409eff">
        <el-menu-item index="/index">
          <i class="el-icon-s-home"></i>
          <span slot="title">Home</span>
        </el-menu-item>
        <el-submenu index="/cv">
          <template slot="title">
            <i class="el-icon-data-board"></i>
            <span>CV Attacks</span>
          </template>
          <el-menu-item index="/appendGoods">
            <i class="el-icon-monitor"></i>
            <span slot="title">Visual Attack</span>
          </el-menu-item>
          <el-menu-item index="/cv-classify">
            <i class="el-icon-menu"></i>
            <span slot="title">Classify an Image</span>
          </el-menu-item>
          <el-menu-item index="/cv-papers">
            <i class="el-icon-document"></i>
            <span slot="title">Paper List</span>
          </el-menu-item>
        </el-submenu>
         <el-submenu index="/nlp">
          <template slot="title">
            <i class="el-icon-s-goods"></i>
            <span>NLP Attacks</span>
          </template>
          <el-menu-item index="/goods">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">Paper List</span>
          </el-menu-item>
          <el-menu-item index="/appendGoods">
            <i class="el-icon-folder-add"></i>
            <span slot="title">Visual Attack</span>
          </el-menu-item>
          <el-menu-item index="/goodsCatg">
            <i class="el-icon-menu"></i>
            <span slot="title">Classifier</span>
          </el-menu-item>
        </el-submenu>
         </el-submenu>
         <el-submenu index="/inter">
          <template slot="title">
            <i class="el-icon-s-goods"></i>
            <span>Interpretability</span>
          </template>
          <el-menu-item index="/goods">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">Paper List</span>
          </el-menu-item>
          <el-menu-item index="/appendGoods">
            <i class="el-icon-folder-add"></i>
            <span slot="title">Visual Attack</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/about">
          <i class="el-icon-s-home"></i>
          <span slot="title">About</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <img src="../assets/images/ai_icon.svg" width="35px">
        <div>
          <a>Onion</a>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 菜单是否折叠
      isCollapsed: false,
      // 被激活的链接地址
      activePath: '/index',
      type: 0,
      name: '',
      typeName: ''
    };
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    // 点击按钮，实现菜单的折叠，切换以及展开
    toggleCollapse () {
      this.isCollapsed = !this.isCollapsed;
    },
    handleSelect (key) {
      console.log(key);
      window.sessionStorage.setItem('activePath', key);
    }
  }
};
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    display: flex;
    background-color: #358ccd;
    align-items: center;
    padding-left: 10px;
    color: #ffffff;
    font-size: 28px;
    font-family: "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    > div {
      display: flex;
      align-items: center;
      padding: 10px;
    }
  }
  .el-aside {
    background-color: #304156;
    transition: width 0.15s;
    .el-menu {
      border-right: 0;
    }
    .toggle-button {
      background-color: #304156;
      font-size: 10px;
      line-height: 24px;
      color: #ffffff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #ffffff;
  }
  .toggle-button {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
