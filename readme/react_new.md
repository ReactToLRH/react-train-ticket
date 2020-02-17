# React 新特性

## Context 与 ContextType

`Context` 提供一种方式，能够让数据在组件树中传递而不必一级一级手动传递。

+ 订阅单个`Context`：可以挂在到`Class`的`ContextType`上,使用`this.context`来获取`Context`上的数据。可以再任何生命周期函数中访问，包括render函数中
+ 订阅多个`Context`：`<Context.Consumer>`进行嵌套即可获取对应数据。

注意：使用 `Context` 会破坏组件的复用性

相关API可参考：[React Context](https://zh-hans.reactjs.org/docs/context.html#api)

## lazy 与 Suspense：动态加载组件

具体参考：[React 代码分割](https://zh-hans.reactjs.org/docs/code-splitting.html)

## memo：用于控制组件过度渲染

具体参考：[React memo](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo)

注意与 [React PureComponent](https://zh-hans.reactjs.org/docs/react-api.html#reactpurecomponent) 的区别
