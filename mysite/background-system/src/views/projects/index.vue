<template>
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table
      v-loading="listLoading"
      :data="data"
      element-loading-text="加载数据中"
      border
      fit
      highlight-current-row
    >
      <!-- 序号 -->
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <!-- 项目名称 -->
      <el-table-column prop="date" label="项目名称" width="150" align="center">
        <template slot-scope="scope"
          ><a class="havera" :href="scope.row.url" target="_blank">{{
            scope.row.name
          }}</a></template
        >
      </el-table-column>
      <!-- 项目描述 -->
      <el-table-column prop="date" label="项目描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.description.toString() }}
        </template>
      </el-table-column>
      <!-- 预览图 -->
      <el-table-column prop="date" label="项目描述" width="150" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 120px"
            :src="scope.row.thumb"
            :preview-src-list="srcList"
          ></el-image>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="前往github"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="iconfont icon-github"
              circle
              size="mini"
              class="github"
              @click="openGithubHandel(scope.row)"
            ></el-button>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editProjectsHandle(scope.row)"
            ></el-button>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="deleProjects(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑对话框 -->
    <el-dialog
      title="请编辑该项目的信息"
      :visible.sync="delogFromVisible"
      fullscreen
    >
      <el-form :model="form">
        <el-form-item label="项目名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="项目描述(每一项描述以英文逗号分隔)">
          <el-input v-model="form.description"></el-input>
        </el-form-item>

        <el-form-item label="项目链接">
          <el-input v-model="form.url"></el-input>
        </el-form-item>

        <el-form-item label="github">
          <el-input v-model="form.github"></el-input>
        </el-form-item>

        <!-- 预览图 -->
        <el-form-item>
          <Upload v-model="form.thumb" uploadTitle="项目预览图" />
        </el-form-item>

        <!-- 排序 -->

        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="分类等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 确认和取消 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="delogFromVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditProjectHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addProject, getProject, setProject, delProject } from "@/api/project";
import { server_URL } from "@/urlConfig";
import Upload from "@/components/Upload.vue";
export default {
  data() {
    return {
      data: [], //数据
      listLoading: false,
      srcList: [],
      delogFromVisible: false, //对话框不可见
      form: {
        name: "",
        description: "",
        url: "",
        github: "",
        thumb: "",
        order: 1,
      },
    };
  },
  components: {
    Upload,
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      (this.listLoading = true),
        getProject().then(({ data }) => {
          this.listLoading = false;
          this.data = data;

          for (let i of this.data) {
            this.srcList.push(i.thumb);
          }
        });
    },
    // 三个按钮跳转
    openGithubHandel(projectInfon) {
       window.open(projectInfon.github)
    },
    // 编辑
    editProjectsHandle(projectInfon) {
      this.delogFromVisible = true;
      console.log(projectInfon);
      //   回填表单
      this.form = {
        ...projectInfon,
        description: projectInfon.description.toString(),
      };
    },
    deleProjects(projectInfon) {
      this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delProject(projectInfon.id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.fetchData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 确认发送请求
    confirmEditProjectHandle() {
      //生成数据发送请求
      let obj = { ...this.form };
      obj.description = this.form.description.split(",");
      obj.order = parseInt(this.form.order);
      setProject(obj.id, obj).then(() => {
        this.delogFromVisible = false;
        this.fetchData();
        this.$message.success("修改成功");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.havera:hover {
  color: rgb(163, 163, 163);
}
.github {
  background-color: rgba(0, 0, 0);
  border: none;
}
</style>