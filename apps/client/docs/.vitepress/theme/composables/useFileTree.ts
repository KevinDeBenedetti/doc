import { computed } from 'vue'

export function useFileTree(englishFiles) {
  // Building the tree structure
  function buildTree(paths) {
    const root = []
    const byKey = new Map()

    function ensureDir(parentArr, parentKey, name) {
      const key = parentKey ? `${parentKey}/${name}` : name
      let node = byKey.get(key)
      if (!node) {
        node = { type: 'dir', name, children: [], key }
        byKey.set(key, node)
        parentArr.push(node)
      }
      return node
    }

    for (const full of paths) {
      // Directly integrated normalization
      const display = full
        .replace(/^\/+/, '')
        .replace(/(^|\/)en\//, '$1')
        .replace(/\.en\.md$/, '.md')
        
      const parts = display.split('/').filter(Boolean)
      let current = root
      let parentKey = ''
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const last = i === parts.length - 1
        
        if (last) {
          current.push({
            type: 'file',
            name: part,
            fullPath: full,
            key: full
          })
        } else {
          const dirNode = ensureDir(current, parentKey, part)
          current = dirNode.children
          parentKey = dirNode.key
        }
      }
    }

    // Sort: directories first then files, alphabetically
    function sortNodes(arr) {
      arr.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
        return a.name.localeCompare(b.name)
      })
      for (const n of arr) {
        if (n.type === 'dir') sortNodes(n.children)
      }
    }
    sortNodes(root)

    return root
  }

  function buildTreeLines(nodes, prefixStack = []) {
    const lines = []

    nodes.forEach((node, idx) => {
      const isLast = idx === nodes.length - 1
      const branch = isLast ? '└── ' : '├── '
      const prefix = prefixStack.map(last => (last ? '    ' : '│   ')).join('')

      lines.push({
        text: `${prefix}${branch}${node.name}`,
        isDir: node.type === 'dir',
        isFile: node.type === 'file',
        fullPath: node.fullPath || null
      })

      if (node.type === 'dir' && node.children?.length) {
        const childLines = buildTreeLines(node.children, [...prefixStack, isLast])
        lines.push(...childLines)
      }
    })

    return lines
  }

  const englishTree = computed(() => buildTree(englishFiles.value))
  const treeLines = computed(() => buildTreeLines(englishTree.value))

  return {
    englishTree,
    treeLines
  }
}