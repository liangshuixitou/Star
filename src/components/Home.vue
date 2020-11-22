<template>
  <el-container class="home-container">
    <el-aside :width="isCollapsed ? '64px' : '200px'">
      <div class="toggle-button" @click="toggleCollapse">
        |||
      </div>
      <el-menu
        :default-active="activePath"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#304156"
        text-color="#fff"
        unique-opened
        :router="true"
        :collapse=isCollapsed
        :collapse-transition="false"
        active-text-color="#409eff">
        <el-menu-item index="/welcome">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-goods"></i>
            <span>商品</span>
          </template>
          <el-menu-item index="/goods">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">商品列表</span>
          </el-menu-item>
          <el-menu-item index="/appendGoods">
            <i class="el-icon-folder-add"></i>
            <span slot="title">添加商品</span>
          </el-menu-item>
          <el-menu-item index="1-1">
            <i class="el-icon-menu"></i>
            <span slot="title">商品分类</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-order"></i>
            <span>订单</span>
          </template>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-s-marketing"></i>
            <span>营销</span>
          </template>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-s-check"></i>
            <span>权限</span>
          </template>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          <span>电商后台管理系统</span>
        </div>
        <el-button @click="signOut" round>退出</el-button>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 菜单是否折叠
      isCollapsed: false,
      // 被激活的链接地址
      activePath: ''
    };
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    signOut () {
      this.$message.success('退出成功');
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    // 点击按钮，实现菜单的折叠，切换以及展开
    toggleCollapse () {
      console.log('1');
      this.isCollapsed = !this.isCollapsed;
    },
    // 保存连接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
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
    justify-content: space-between;
    background-color: #409eff;
    align-items: center;
    padding-left: 10px;
    color: #ffffff;
    font-size: 28px;
    font-family: "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    > div {
      display: flex;
      align-items: center;
      padding: 15px;
    }
  }
  .el-aside {
    background-color: #304156;
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
