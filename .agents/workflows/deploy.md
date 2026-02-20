---
description: 部署并预览应用 (Build & Preview)
---

这个工作流会帮助你在本地构建应用并启动预览服务器，确保构建产物符合预期。

// turbo
1. 安装依赖 (如果尚未安装)
```bash
npm install
```

// turbo
2. 执行生产环境构建
```bash
npm run build
```

3. 启动本地预览服务器
```bash
npm run preview
```

> [!NOTE]
> 预览服务器启动后，你可以在浏览器中访问提供的链接来检查构建后的版本是否运行正常。如果一切正常，你可以将 `dist` 目录下的内容上传到托管平台。
