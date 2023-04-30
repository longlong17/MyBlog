<template>
  <div class="dashboard-container">
    <div class="inTota-container">
      <div class="inTota"></div>
    </div>
    <div class="graphical">
      <div id="dashboard-main" class="main public"></div>
      <div class="Pie-charts public"></div>
    </div>
    <div class="projectGraphical-containerr">
      <div class="projectGraphical public"></div>
    </div>
  </div>
</template>

<script>
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from "echarts/components";
import * as echarts from "echarts";
import { CanvasRenderer } from "echarts/renderers";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { BarChart } from "echarts/charts";
import { getBlogType } from "@/api/blogType.js"; //博客
import { getProject } from "@/api/project"; // 项目
import { getComment } from "@/api/comment.js"; // 评论api
import { getMessage } from "@/api/message.js"; //留言板
export default {
  data() {
    return {
      // 个人空间总信息
      inTotal: {
        title: {
          text: "个人空间总信息",
        },
        tooltip: {},
        xAxis: {
          data: ["博客数", "项目数", "评论数", "留言数"],
        },
        yAxis: {},
        series: [
          {
            name: "信息数量柱形图",
            type: "bar",
            data: [],
          },
        ],
      },
      //博客柱状图配置
      blogsNumber: {
        title: {
          text: "博客数量",
        },
        tooltip: {},
        xAxis: {
          data: [],
        },
        yAxis: {},
        series: [
          {
            name: "博客数量",
            type: "bar",
            data: [],
          },
        ],
      },
      // 博客饼图配置
      pieChartDispose: {
        title: {
          text: "博客好评度占比",
        },
        series: [
          {
            type: "pie",
            data: [
              {
                value: 400,
                name: "超级喜爱",
              },
              {
                value: 300,
                name: "良好",
              },
              {
                value: 230,
                name: "中",
              },
              {
                value: 100,
                name: "差",
              },
              {
                value: 500,
                name: "回看率",
              },
              {
                value: 450,
                name: "点赞率",
              },
            ],
            roseType: "area",
          },
        ],
      },
      // 项目饼图图配置
      projectGraphical: {
        title: {
          text: "项目饼图",
        },
        series: [
          {
            type: "pie",
            data: [],
            roseType: "area",
          },
        ],
      },
    };
  },
  created() {
    // 注册
    echarts.use([
      TitleComponent,
      TooltipComponent,
      GridComponent,
      DatasetComponent,
      TransformComponent,
      BarChart,
      LabelLayout,
      UniversalTransition,
      CanvasRenderer,
    ]);
    this.fetchData();
  },
  methods: {
    // 总图
    setInTotal() {
      let myChart = echarts.init(document.querySelector(".inTota"));
      // 博客 柱状图
      myChart.setOption(this.inTotal);
    },
    //博客柱状图
    generateDrawing() {
      let myChart = echarts.init(document.getElementById("dashboard-main"));
      // 博客 柱状图
      myChart.setOption(this.blogsNumber);
    },
    //博客饼图
    pieChart() {
      let myChart = echarts.init(document.querySelector(".Pie-charts"));
      myChart.setOption(this.pieChartDispose);
    },
    //项目饼图图
    peoject() {
      let myChart = echarts.init(document.querySelector(".projectGraphical"));
      myChart.setOption(this.projectGraphical);
    },
    fetchData() {
      // 博客柱状图获取数据
      getBlogType().then((res) => {
        let data = res.data;
        for (let item of data) {
          this.blogsNumber.xAxis.data.push(item.name);
          this.blogsNumber.series[0].data.push(item.articleCount);
        }
        this.inTotal.series[0].data.push(data.length);
        this.generateDrawing();
        this.pieChart(); //调用生成图像函数
      });
      // 项目柱状图获取数据
      getProject().then(({ data }) => {
        for (let item of data) {
          this.projectGraphical.series[0].data.push({
            value: 350,
            name: item.name,
          });
        }
        this.inTotal.series[0].data.push(data.length);
        this.peoject();
      });
      //  评论数量
      getComment().then(({ data }) => {
        this.inTotal.series[0].data.push(data.total);
        // 留言数量
        getMessage().then(({ data }) => {
          this.inTotal.series[0].data.push(data.total);
          this.setInTotal();
        });
      });
    },
  },

};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.graphical {
  display: flex;
}
.public {
  width: 500px;
  height: 400px;
  // background: red;
}
.inTota-container{
  width: 100%;
  display: flex;
  justify-content: center;
}
.inTota{
  width: 800px;
  height: 600px;
}
</style>
