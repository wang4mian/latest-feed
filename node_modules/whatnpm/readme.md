# whatnpm
是什么 node 包管理器? 

-- 此项目用于猜测你的项目之前使用了什么包管理器.

命令行方式:
``` sh
# 安装
npm i -g whatnpm

# 使用
whatnpm
``` 

require 方式:
``` js
const { manager } = require(`whatnpm`)
console.log(`manager`, manager().er) // yarn
```

## 为什么开发此项目
众所周知道 node 包管理器有很多, 例如: npm cnpm pnpm yarn yarn2, tyarn...

大部分的情况下, 他们都可以混合使用. 这是由于 nodejs 的 require 有很强的兼容性.

但是后来各个包管理器为了追求极致的安装速度, 会导致兼容性出现问题, 例如幽灵依赖, 虚拟文件...

所以这时候混合使用就可能出现问题.


## 如何实现
检测每个包管理器安装后的一些特征, 例如:
- 依赖锁文件
  - 文件名
  - [ ] 创建时间
- package.json 中的 packageManager 字段
- node_modules 中的文件
- 是否已安装
- [ ] 使用频率


### 相似项目
- [@antfu/ni](https://www.npmjs.com/package/@antfu/ni) 期望统一包管理器的命令行参数
- [only-allow](https://github.com/pnpm/only-allow) 强制在项目中使用特定的包管理器
- [which-pm-runs](https://www.npmjs.com/package/which-pm-runs) 在安装阶段的时候检测包管理器
- [preferred-pm](https://github.com/zkochan/packages/tree/main/preferred-pm) 分析 lock 文件猜测包管理器

