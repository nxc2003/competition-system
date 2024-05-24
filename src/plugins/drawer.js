import Vue from 'vue';  // 导入Vue库
import Drawer from '@/components/Drawer';  // 导入自定义的Drawer组件

/**
 * $drawer的扩展函数
 */
export default function(data) {
  // 创建一个Drawer组件的Vue实例
  const instance = new Vue(Drawer);

  // 将传入的data对象的属性合并到Drawer组件实例的data属性中
  Object.assign(instance.$data, data);

  // 将Drawer组件实例挂载到DOM中，并将其根元素添加到document.body中
  document.body.appendChild(instance.$mount().$el);

  // 显示Drawer组件
  instance.visible = true;
};
