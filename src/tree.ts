
// 深拷贝
export const deepAssign: (to: { [key: string]: any }, from: { [key: string]: any }) => Object = (to, from) => {
  Object.keys(from).forEach(key => {
    const val = from[key]
    if (typeof val === 'object') {
      to[key] = Array.isArray(val) ? deepClone(val) : deepAssign({}, val)
    } else {
      to[key] = from[key]
    }
  })
  return to
}

export const deepClone: (obj: Object) => Object = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item))
  }
  if (typeof obj === 'object') {
    return deepAssign({}, obj)
  }
  return obj
}

// 广度优先
export function treeForeach<T> (
  tree: T[]| T,
  func: (node: T) => void,
  childrenKey = 'children'
) {
  let node
  const list: Array<T> = Array.isArray(tree) ? [...tree] : [tree]
  while ((node = list.shift())) {
    func(node)
    node[childrenKey] && list.push(...node[childrenKey])
  }
}

/**
 * 深度优先遍历，返回节点信息及深度
 * @param tree 
 * @param func 
 * @param childrenKey 
 */
export function treeDeepForeach<T> (
  tree: T[] | T,
  func: (node: T, deep: number) => void,
  childrenKey = 'children'
) {
  let deep = 0
  const each = (node: T) => {
    deep++
    func(node, deep)
    if (node[childrenKey] && node[childrenKey].length) {
      node[childrenKey].forEach((item: T) => {
        each(item)
      })
    }
    deep--
  }
  if (Array.isArray(tree)) {
    tree.forEach(item => {
      each(item)
    })
  } else if (typeof tree === 'object') {
    each(tree)
  }
}

/**
 * @author guojianqiang
 * @description 查找匹配树节点并返回当前节点信息及深度
 * @param tree 
 * @param func 
 * @param childrenKey
 */
export function findTreeNode<T> (
  tree: T[] | T,
  func: (node: T) => boolean,
  childrenKey = 'children'
) {
  let deep = 0
  const find: (node: T, children: T[]) => T | null = (node, children = []) => {
    deep++
    if (func(node)) {
      return { ...node, deep, sibling: children }
    }
    if (node[childrenKey] && node[childrenKey].length) {
      for (let item of node[childrenKey]) {
        const rnode = find(item, node[childrenKey])
        if (rnode) return { ...rnode, deep }
      }
    }
    deep--
    return null
  }
  if (Array.isArray(tree)) {
    for (let item of tree) {
      const rnode = find(item, tree)
      if (rnode) return rnode
    }
  } else if (typeof tree === 'object') {
    return find(tree, [])
  }
}
/**
 * 树条件过滤
 * @param tree 
 * @param func 
 * @param childrenKey 
 */
export function filterTree<T> (
  tree: T[] | T,
  func: (node: T) => boolean,
  childrenKey = 'children'
) {
  let _tree: T[]
  if (typeof tree !== 'object') {
    console.warn('the tree is not object')
    return []
  }
  if (!Array.isArray(tree)) {
    _tree = [tree]
  } else {
    _tree = [...tree]
  }
  const filter: (arr: Array<T>) => Array<T> = (arr) => {
    return arr.map(node => ({...node})).filter((item) => {
      if (item[childrenKey] && item[childrenKey].length) item[childrenKey] = filter(item[childrenKey])
      if (item[childrenKey] && !item[childrenKey].length) delete item[childrenKey]
      return (item[childrenKey] && item[childrenKey]) || func(item)
    })
  }
  return filter(_tree)
}
/**
 * 数组转树
 * @param list 
 * @param childrenKey 孩子键
 * @param parentIdKey 父id键
 * @param defaultRootId 默认根级id
 */
export function listToTree<T> (
  list: T[],
  childrenKey = 'children',
  parentIdKey = 'parentId',
  defaultRootId = 0
) {
  const map = list.reduce((prevMap: T, current: T & {id: number | string}) => {
    prevMap[current.id] = current
    return prevMap
  }, {})
  return list.filter(item => {
    if (map[item[parentIdKey]]) {
      if (!map[item[parentIdKey]].children) map[item[parentIdKey]][childrenKey] = []
      map[item[parentIdKey]][childrenKey].push(item)
    }
    return item[parentIdKey] === defaultRootId
  })
}
/**
 * 树转数组
 * @param tree 
 * @param childrenKey 
 */
export function treeToList<T> (
  tree: T[] | T,
  childrenKey = 'children'
) {
  const list: Array<T> = []
  treeDeepForeach(tree, node => {
    list.push(node)
  }, childrenKey)
  return list
}

/**
 * @author gjq
 * @description 获取当前节点路径
 * @param nodes
 * @param handler
 * @param key
 */

export function getTreePath<T>(nodes: Array<T>, handler: (node: T) => {}, key = 'children') {
  nodes = !Array.isArray(nodes) ? [nodes] : [...nodes]
  const path: Array<T> = []
  const getPaths = (tree: Array<T>): any => {
    for (let i = 0; i < tree.length; i++) {
      const item = tree[i]
      path.push(item)
      if (handler(item)) {
        return path
      }
      if (item[key] && item[key].length) {
        const childrenPath = getPaths(item[key])
        if (childrenPath.length) return childrenPath
      }
      path.pop()
    }
    return []
  }
  return getPaths(nodes)
}

export default {
  deepClone,
  treeForeach,
  treeDeepForeach,
  findTreeNode,
  filterTree,
  listToTree,
  treeToList,
  getTreePath
}