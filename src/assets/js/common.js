// 遍历查询取节点
export const queryTreeNode = (tree, val, key = 'id') => {
    if (!tree) return null;
    for (const node of tree) {
        if (node[key] === val) return node;
        if (node.children) {
            let res = queryTreeNode(node.children, val, key);
            if (res) return res;
        }
    }
    return null;
}

// 树形取自定义对象数据
export const getTreeData = (tree, key, value, children = 'children') => {
    if (!tree) return [];
    return tree.map(r => ({
        [key]: r[key],
        [value]: r[value],
        [children]: r.children ? getTreeData(r.children, key, value) : undefined
    }))
}
