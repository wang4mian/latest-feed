#!/usr/bin/env node

const fs = require(`fs`)
const cp = require(`child_process`)
const path = require(`path`)
const sortby = require(`lodash.sortby`)

// 特征表, 为字符串时, 匹配特征行分为 1, 为数组时, 第二项为自定义得分
const map = [
  {
    manager: `npm`,
    version: `8.15.1`,
    // 文件是否存在
    file: [
      `npm-shrinkwrap.json`,
      `package-lock.json`,
      [`node_modules/.package-lock.json`, 2],
    ],
    // package.json 中的 packageManager 字段的值
    packageManager: undefined, // 例如 /^npm/
    // 命令运行历史中存在
    history: undefined, // 例如 1
    // 命令已被安装
    install: undefined, // 例如 1
    // 当特征相同时的优先级
    priority: undefined, // 默认声明是位置越向前优先级越高
  },
  {
    manager: `yarn`,
    version: `7.1.0`,
    file: [
      `yarn.lock`,
      [`node_modules/.yarn-integrity`, 2],
    ],
  },
  {
    manager: `pnpm`,
    version: `6.32.3`,
    file: [
      `pnpm-lock.yaml`,
      [`node_modules/.pnpm`, 2],
      [`node_modules/.modules.yaml`, 2],
    ],
  },
  {
    manager: `cnpm`,
    version: `7.1.0`,
    file: [
      `package-lock.json`,
      [`node_modules/.package_versions.json`, 2],
    ],
  },
  {
    manager: `nonpm`,
    file: [],
  },
]

// 把简写的 map 扩展为完整格式
const mapRes = map.map(item => {
  item.file = item.file.map(file => {
    return typeof(file) === `string` ? [file, 1] : file
  })
  item.packageManager = (() => {
    if(item.packageManager) {
      return typeof(item.packageManager) === `string` ? [item.packageManager, 1] : item.packageManager
    } else {
      return [new RegExp(`^[\^]?${item.manager}`), 1]
    }
  })();
  item.history = typeof(item.history) === `number` ? item.history : 1
  item.install = typeof(item.install) === `number` ? item.install : 1
  item.score = item.score || 0
  return item
})

if (require.main === module) { // 通过 cli 使用
  const res = manager(process.cwd())
  console.log(`runRes: `)
  console.log(res.runRes)
  console.log(`dir: ${res.dir}`)
  console.log(`er: ${res.er}`)
} 

/**
 * 获取 node_modules 所在目录
 * 优先从运行路径开始查找, 再从执行路径开始查找
 */
function getModulesDir(startPath) {
  const pathList = [
    ...startPath.split(/[/\\]/).reduce((acc, cur, index, arr) => {
      acc[index] = [...arr.slice(0, index + 1), `node_modules`].join(`/`)
      return acc
    }, []).reverse(),
  ]
  const dir = (pathList.find(path => fs.existsSync(path)) || process.cwd())
  return dir.replace(/node_modules[/\\]?$/, ``)
}


/**
 * 允许运行失败的函数
 * @param {*} fn 
 */
function tryFn(fn) {
  try {
    fn()
  } catch (error) {
    // ...
  }
}


/**
 * 获取命令运行历史 // todo
 * linux 中可以在命令行中通过 history 命令显示历史, 可以通过 ~/.bash_history 文件读取历史
 * windows 中可以通过 cmd `doskey /history` 命令显示历史, 不知如何从程序中如何读取
 * windows 中可以通过 ps `history` 命令显示历史, 不知如何从程序中如何读取
 */
function getHistory() {
}

function manager(startPath = __dirname) {
  const dir = getModulesDir(startPath) // 当前运行目录
  let runRes = mapRes.map((item, index) => {
    let scoreObj = {
      file: 0,
      packageManager: 0,
      history: 0,
      install: 0,
    }
    tryFn(() => {
      scoreObj.file = + item.file.reduce((acc, [file, useScore]) => {
        acc = acc + (fs.existsSync(`${dir}/${file}`) ? useScore : 0);
        return acc
      }, 0)
    })
    tryFn(() => {
      scoreObj.packageManager = require(`${dir}/package.json`).packageManager.match(item.packageManager[0]) ? item.packageManager[1] : 0
    })
    tryFn(() => {
      cp.execSync(`${item.manager} -v`, {stdio: `ignore`})
      scoreObj.install = item.install
    })
    item.scoreObj = scoreObj
    item.priority = item.priority || (mapRes.length - index);
    item.score = Object.entries(scoreObj).reduce((acc, [key, val]) => (acc + val), 0)
    return item
  })
  runRes = sortby(runRes, [`score`, `priority`])
  return {
    dir,
    runRes,
    er: runRes[runRes.length - 1].manager,
  }
}

module.exports = {
  manager,
}