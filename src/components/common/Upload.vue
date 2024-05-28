<template>
  <a-modal
    ok-text="开始上传"
    cancel-text="取消"
    centered
    :title="`${record.title} 附件上传`"
    :visible="visible"
    :mask-closable="false"
    :body-style="{ padding: '10px' }"
    :confirm-loading="loading"
    :destroy-on-close="true"
    :after-close="reset"
    @cancel="onCancel"
    @ok="uploadFile"
  >
    <a-upload
      ref="uploader"
      class="upload"
      accept=".png,.jpg,.jpeg,.pdf"
      list-type="picture"
      :remove="handleRemove"
      :before-upload="getFile"
      @preview="preview"
    >
      <a-button
        block
        :disabled="!!file"
      >
        <a-icon type="upload" />
        点击上传文件，仅支持 png、.jpg、.jpeg、.pdf 小于2mb
      </a-button>
    </a-upload>
    <a-progress
      v-show="showProgress"
      :status="uploadStatus"
      :percent="uploadPercent"
    />
    <a-modal
      width="min-content"
      :visible="previewVisible"
      :footer="null"
      :destroy-on-close="true"
      @cancel="previewVisible = false"
    >
      <img
        style="object-fit: scale-down"
        :src="imgUrl"
        alt="预览图片"
      >
    </a-modal>
  </a-modal>
</template>

<script>
import { message } from 'ant-design-vue'; // 从 ant-design-vue 中导入消息组件
// import { createNamespacedHelpers } from 'vuex'; // 从 vuex 中导入 createNamespacedHelpers 函数
import { getToken, fresh } from '../../api'; // 从 api 模块中导入 getToken 和 fresh 函数
import { uploader } from '@/utils/qiniu'; // 从 utils/qiniu 模块中导入 uploader 函数

// const { mapActions } = createNamespacedHelpers('records'); // 创建命名空间的 vuex 辅助函数
export default {
  name: 'Upload', // 组件名称
  props: {
    visible: {
      type: Boolean,
      required: true, // 控制模态框的显示与隐藏
    },
    record: {
      type: Object,
      required: true, // 当前记录对象
    },
  },
  data() {
    return {
      ...data, // 初始化组件数据
    };
  },
  methods: {
    reset() {
      Object.assign(this, data); // 重置组件数据
    },
    onCancel() {
      this.$emit('update:visible', false); // 关闭模态框
    },
    getFile(file) {
      this.file = file; // 获取文件对象
      this.sizeLimited(file.size); // 检查文件大小
      return false; // 取消自动上传
    },
    handleRemove() {
      this.file = null; // 移除文件对象
    },
    async preview({ type, originFileObj }) {
      if (!type.includes('image')) {
        return message.warn('该类型暂不支持预览'); // 如果文件类型不支持预览，则显示警告信息
      } else if (!this.sizeLimited(originFileObj.size)) {
        return;
      }
      this.imgUrl = await createObjectUrl(originFileObj); // 创建文件 URL
      this.previewVisible = true; // 显示预览模态框
    },
    sizeLimited(size) {
      const limitIn2M = size / Math.pow(1024, 2) < 2; // 文件大小是否小于 2MB
      if (!limitIn2M) {
        message.warn('图片大小超出限制（2mb）'); // 如果文件大小超出限制，则显示警告信息
        return false;
      }
      return true; // 返回文件大小是否符合限制
    },
    uploadFile() {
      uploadFile.call(this); // 调用上传文件函数
    },
  },
};

// 组件的数据对象
const data = {
  loading: false, // 上传过程中显示加载状态
  showProgress: false, // 是否显示进度条
  imgUrl: '', // 预览图片的 URL
  file: null, // 文件对象
  uploadPercent: 0, // 上传进度百分比
  uploadStatus: 'active', // 上传状态
  previewVisible: false, // 是否显示预览模态框
};

// 创建文件 URL
function createObjectUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result); // 读取文件成功时解析 Promise
    reader.onerror = reject; // 读取文件失败时拒绝 Promise
  });
}

// 文件上传函数
function uploadFile() {
  if (!this.file) {
    return message.warn('请选择要上传的文件'); // 如果没有文件，则显示警告信息
  }
  const { file } = this;
  if (!this.sizeLimited(file.size)) {
    return; // 如果文件大小超出限制，则返回
  }
  const name = this.record._id; // 获取记录 ID
  const promise = this.record.uploaded
    ? getToken({ name }) // 如果记录已上传，则获取覆盖上传的 token
    : getToken(); // 否则获取新的 token
  promise.then(({ data: token }) => {
    const observer = uploader(name, file, token); // 调用上传函数
    // 开始传输
    this.uploadStatus = 'active'; // 设置上传状态为 active
    this.uploadPercent = 0; // 重置上传进度百分比
    this.loading = true; // 显示加载状态
    this.showProgress = true; // 显示进度条
    observer.subscribe(
      next.bind(this), // 订阅上传过程中的事件
      error.bind(this), // 订阅上传错误事件
      complete.bind(this), // 订阅上传完成事件
    );
  });
}

// 定义传输过程中的状态处理函数
function next({ total }) {
  this.uploadPercent = +total.percent.toFixed(1); // 更新上传进度百分比
}

// 定义上传错误处理函数
function error(err) {
  this.uploadStatus = 'exception'; // 设置上传状态为异常
  this.loading = false; // 取消加载状态
  console.error(err); // 打印错误信息
}

// 定义上传完成处理函数
function complete({ key: name }) {
  const record = { ...this.record };
  record.uploaded = true; // 标记为已上传状态
  Promise.all([
    fresh({ name }), // 重新上传文件，需要刷新 cdn 缓存，否则预览文件不会变化
    this.updateRecord(record), // 更新记录
  ]).then(([{ data: result }]) => {
    this.uploadStatus = 'success'; // 设置上传状态为成功
    if (result.code === 1) {
      console.warn('CDN刷新失败，errMsg: ' + result.msg); // 如果刷新 CDN 失败，则打印警告信息
    }
    setTimeout(() => {
      this.loading = false; // 取消加载状态
      this.$emit('update:visible', false); // 关闭模态框
      this.$emit('complete'); // 触发上传完成事件
    }, 800);
  });
}

</script>

<style scoped lang="stylus">
  .upload
    margin-bottom 10px  // 上传组件的底部边距为 10px
    >>> div:first-child
      width 100%  // 第一个子元素的宽度为 100%
</style>
