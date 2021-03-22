# 总结一些常用的tree操作函数
## 函数介绍
- 深度优先遍历
- 广度优先遍历
- 深拷贝
- 查找匹配树节点并返回当前节点信息及深度
- 树条件过滤
- 数组转树
- 树转数组
- 获取当前节点路径
## 安装
```shell
npm install common-tree-func
```
## 使用
demo1
```js
import tree from 'common-tree-func'

const obj = {
  name: '小明'
  age: 25,
  children: [
    {
      name: '小红',
      age: 1
    }
  ]
}

const cloneObj = tree.deepClone(obj)

```

demo2
```js
import tree, {filterTree} from 'common-tree-func'

const obj = [
  {
    name: '小明'
    age: 25,
    children: [
      {
        name: '小红',
        age: 1
      }
    ]
  },
  {
    name: '张xx',
    age: 33
  }
]
// 树过滤
const newTree = filterTree(obj, node => node.name === '小红')
```
