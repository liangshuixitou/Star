<template>
    <div v-show="isShow" ref="chart" style="margin-top:40px;width: 100%;height: 100%"></div>
</template>

<script>
export default {
  name: 'LineChart',
  props: {
    chart_data: null,
    epsilon: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isShow: false,
      data: this.chart_data,
      epsilons: this.epsilon
    };
  },
  methods: {
    decimal (num, n) {
      const v = Math.pow(10, n);
      return Math.round(num * v) / v;
    },
    getEchartData () {
      if (this.data === null || this.data.length === 0) {
        return;
      }
      this.isShow = true;
      this.$nextTick(() => {
        const chart = this.$refs.chart;
        const nameList = [];
        const dataList = [];
        for (let i = 0; i < this.epsilons.length; ++i) {
          this.epsilons[i] = this.decimal(this.epsilons[i], 4);
        }
        for (let i = 0; i < this.data.data.data.length; ++i) {
          nameList.push(this.data.data.data[i].name);
          dataList.push({
            name: this.data.data.data[i].name,
            type: 'line',
            data: this.data.data.data[i].data
          });
        }
        // dataList.push({
        //   type: 'line',
        //   markLine: {
        //     silent: true,
        //     lineStyle: {
        //       normal: {
        //         type: 'solid',
        //         color: 'green',
        //         width: 5,
        //         cap: 'square',
        //         join: 'miter'
        //       }
        //     },
        //     data: [{
        //       yAxis: this.data.per
        //     }],
        //     label: {
        //       position: 'top',
        //       normal: {
        //         formatter: this.data.per + '%'
        //       }
        //     },
        //   },
        // });
        if (chart) {
          const myChart = this.$echarts.init(chart);
          myChart.clear();
          const option = {
            title: {
              text: this.data.name
            },
            legend: {
              data: nameList
            },
            tooltip: {
              trigger: 'axis'
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: { type: 'category', data: this.epsilons },
            yAxis: { type: 'value' },
            series: dataList
          };
          myChart.setOption(option);
          window.addEventListener('resize', function () {
            myChart.resize();
          });
        }
      });
    }
  },
  watch: {
    chart_data: {
      // 监控数据的变化，并刷新图表
      handler (newVal) {
        this.chart_data = newVal;
        this.getEchartData();
      },
      deep: true
    }
  },
  mounted () {
    this.getEchartData();
  }
};
</script>

<style scoped>

</style>
