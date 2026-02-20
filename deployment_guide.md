# Vocabulary App 部署指南

这是一个基于 Vite + React 构建的前端项目。你可以通过以下几种方式进行部署：

## 1. Vercel (推荐)
Vercel 是部署 Vite 应用最简单的方式，提供自动化的 CI/CD。

- **操作步骤**：
  1. 将代码推送到 GitHub/GitLab。
  2. 在 [Vercel 控制台](https://vercel.com/new) 导入你的仓库。
  3. Vercel 会自动识别 Vite 项目并配置构建命令 (`npm run build`) 和输出目录 (`dist`)。
  4. 点击 "Deploy" 即可。

## 2. Netlify
与 Vercel 类似，Netlify 也是非常优秀的静态托管平台。

- **操作步骤**：
  1. 登录 [Netlify](https://app.netlify.com/) 并关联 GitHub。
  2. 选择项目仓库。
  3. 构建设置：
     - **Build Command**: `npm run build`
     - **Publish directory**: `dist`
  4. 点击 "Deploy site"。

## 3. GitHub Pages
如果你使用 GitHub 托管代码，可以直接利用 GitHub Pages。

- **操作步骤**：
  1. 安装 `gh-pages` 包：`npm install -D gh-pages`
  2. 在 `package.json` 中添加 `"homepage": "https://<your-username>.github.io/<your-repo-name>"`。
  3. 在 `scripts` 中添加：
     ```json
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
     ```
  4. 运行 `npm run deploy`。

## 4. Docker 部署
如果你想使用 Docker 进行部署，我已经为你准备好了 `Dockerfile` 和 `docker-compose.yml`。

- **构建并运行**：
  ```bash
  docker-compose up -d --build
  ```
- 应用将在 `http://localhost:8080` 运行。

## 5. 自建托管平台 (Self-hosted PaaS)
如果你想在自己的服务器上拥有类似 Vercel 的体验，可以使用以下 Docker 驱动的开源平台：

### A. Coolify (强烈推荐)
Coolify 是目前最流行的开源 Vercel/Netlify 替代方案。它支持 Docker, Git 自动化部署，甚至可以自动配置 SSL。

- **特点**：
  - 界面美观，操作简单。
  - 支持直接从 GitHub/GitLab 部署。
  - 内置多种服务（数据库、Redis等）。
- **安装**：在一台干净的 Ubuntu VPS 上运行：
  ```bash
  curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
  ```

#### 如何在 NAS 上手动安装 Coolify (YAML 方式)
如果你的 NAS 支持 Docker Compose (如群晖的 Container Manager 或 SSH)：

1. **准备目录**：在 NAS 上创建 `/docker/coolify` 目录。
2. **保存配置**：将我为你生成的 [coolify-setup.yaml](file:///Users/ninjaisun/Workspace/local_notes/vocabulary-app/coolify-setup.yaml) 内容保存为该目录下的 `docker-compose.yml`。
3. **启动**：
   - SSH 运行：`docker-compose up -d`
   - GUI 运行：在 Container Manager 中创建一个新项目，选择该文件夹。
4. **访问**：在浏览器打开 `http://<NAS_IP>:8000`。
5. **初始化**：第一次进入时，Coolify 会引导你完成基础设置。

> [!TIP]
> **关于端口冲突**：如果启动时提示 `8765` 端口被占用（NAS 上常见的冲突），我已经在 YAML 中预先将该端口映射到了 `8766`。你可以根据需要修改 `docker-compose.yml` 中的左侧端口号。

### B. CapRover
CapRover 是另一个优秀的、非常轻量级的自托管集群管理器。

- **安装**：
  ```bash
  docker run -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
  ```

### C. Dokku
Docker 驱动的 PaaS 鼻祖，类似于一个极简的命令行版 Heroku。

---
> [!TIP]
> 如果你有一台 VPS，**Coolify** 是目前自建托管平台的最佳选择，它提供了极简的 UI 来管理你的所有 Docker 容器和静态站点。
