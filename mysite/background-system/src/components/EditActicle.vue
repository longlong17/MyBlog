<template>
  <div>
    <!-- 文章标题 -->
    <div class="blocktitle">文章标题</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
    </div>
    <!-- 文章编辑 -->
    <div class="blocktitle">文章编辑</div>
    <Editor
      :initialValue="form.editorText"
      ref="toastuiEditor"
      height="600px"
      :options="editorOprions"
    />
    <!-- 文章描述 -->
    <div class="blocktitle">
      <el-input
        rows="7"
        type="textarea"
        v-model="form.description"
        placeholder="请输入文章描述"
      ></el-input>
    </div>
    <!-- 头像上传 -->
    <Upload v-model="form.thumb" uploadTitle="文章头图" />

    <!-- 文章分类 -->
    <div class="blocktitle">
      选择分类
      <el-select v-model="form.select"  @change="changeHandle" placeholder="选择文章分类">
        <el-option
          v-for="item in blogType"
          :key="item.id"
          :label="item.name"
          :value="item.id"
         
        ></el-option>
      </el-select>
    </div>
    <!-- 按钮 -->
    <el-button type="primary" style="margin: 40px 0" @click="addBlogHandel">{{
      mode === "add" ? "发布文章" : "修改文章"
    }}</el-button>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import Upload from "@/components/Upload";
import { getBlogType } from "@/api/blogType.js";
import { addBlog, editBlog, findOneBlog } from "@/api/blog.js";
import "@toast-ui/editor/dist/i18n/zh-cn";
export default {
  data() {
    return {
      form: {
        tirle: "",
        editorText: "", //文章标题
        description: "", //文章描述
        thumb: "", //文章的图片
        select: "", //分类
      },
      blogType: [], //存放博客分类
      editorOprions: {
        language: "zh-CN",
      },
      id: "",
    };
  },
  props: ["mode"],
  created() {
    // 拿取分类的数据
    getBlogType().then(({ data }) => {
      this.blogType = data;
    });
    if (this.mode === "edit") {
      this.id = this.$route.params.id;
      findOneBlog(this.id).then(({ data }) => {
        // 接下来，将这个内容回填至表单
        this.form = data;
        this.form.select = data.category === null ? "" : data.category.id;
        this.$refs.toastuiEditor.invoke("setHTML", data.htmlContent);
      });
    }
  },
  components: {
    Editor,
    Upload,
  },
  methods: {
    addBlogHandel() {
      // 获取表单内容 发送请求
      let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markdow = this.$refs.toastuiEditor.invoke("getMarkdown");
      //组装要传递给服务器的对象
      let obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime,
        categoryId: this.form.select,
        htmlContent: html,
        thumb: this.form.thumb,
        markdownContent: markdow,
      };
      if (obj.title && obj.description && obj.htmlContent && obj.categoryId) {
        if (this.mode === "add") {
          //说明是新增的
          addBlog(obj).then(() => {
            this.$message.success("添加分类成功");
            this.$router.push("/blogList");
          });
        } else if (this.mode === "edit") {
          //是要编辑
          editBlog({ id: this.form.id, data: obj }).then(() => {
            this.$router.push("/blogList"); // 跳转到文章列表
            this.$message.success("文章修改成功");
          });
        }
      } else {
        this.$message.error("请填写必要的内容");
      }
    },
    changeHandle() {
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
.blocktitle {
  margin: 15px 0;
  font-weight: 100;
}
</style>