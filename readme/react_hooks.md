# [React Hooks](https://zh-hans.reactjs.org/docs/hooks-intro.html)

## 类组件的不足 与 Hooks优势

### 类组件的不足

+ 状态逻辑复用难
  + 缺少复用机制
  + 渲染属性和高阶组件导致层级冗余
+ 趋向复杂难以维护
  + 生命周期函数混杂不相干逻辑
  + 相干逻辑分散在不用生命周期
+ `this`指向困扰
  + 内联函数过度创建新句柄
  + 类成员函数不能保证`this`

### Hooks优势

+ 函数组件无`this`问题
+ 自定义Hook方便复用状态逻辑
+ 副作用的关注点分离
