# New-API 前端二次改造指南（web/default）

> 目标：深度改造 UI，**不动后端核心功能**。前后端只通过 `/api` 通信，只要不改 `web/` 以外的 `.go` 代码、不改 API 调用方式，核心逻辑不受影响。

## 技术栈
- React 19 + TypeScript
- 构建：**Rsbuild**（不是 Vite）
- 路由：**TanStack Router**（文件式路由，`src/routes/`）
- UI：**Tailwind v4 + shadcn/ui**（`src/components/ui/`）
- 数据：TanStack Query / Table、zustand、axios
- i18n：i18next（`src/i18n/`）

## 一、本地开发（热更新）
```bash
./dev.sh start     # 启动，端口 3001，自动代理 /api /mj /pg → 后端 :3000
./dev.sh log       # 看日志
./dev.sh stop      # 停止
```
访问 `http://<服务器IP>:3001`（需放行 3001 端口）。改 `web/default/src` 下任意文件即时热更新。

## 二、改造入手点
| 想改什么 | 改哪里 |
|---------|--------|
| 主题色/圆角/字体 | `src/styles/theme.css`（改 `:root` 和 `.dark` 里的 `--primary` 等 oklch 变量）|
| 预设配色方案 | `src/styles/theme-presets.css` |
| 系统名/品牌配置 | `src/config/index.ts` |
| 页面标题/favicon | `index.html` |
| 侧边栏菜单结构 | `src/components/layout/data/sidebar-data.ts` |
| 侧边栏/Logo 组件 | `src/components/layout/app-sidebar.tsx` |
| 顶栏/头部 | `src/components/layout/header.tsx`、`top-nav.tsx` |
| 整体布局框架 | `src/components/layout/authenticated-layout.tsx`、`main.tsx` |
| 页面/路由 | `src/routes/`（`__root.tsx` 根、`_authenticated/` 登录后页面、`(auth)/` 登录注册）|
| 通用 UI 组件 | `src/components/ui/`（shadcn 组件，可直接改）|

> 运行时还能在后台「系统设置」里改系统名、Logo、公告、首页等，无需改代码。

## 三、部署改造后的版本
已配置 `docker-compose.override.yml`，用本地 Dockerfile 构建（含你改的前端）：
```bash
docker compose up -d --build    # 构建并部署（首次约几分钟：编译前端+Go）
docker compose logs -f new-api  # 看日志
```
回到官方预编译镜像：删除/改名 `docker-compose.override.yml` 再 `docker compose up -d`。

## 四、跟进上游更新
```bash
git fetch upstream
git checkout custom
git merge upstream/main      # 或 git rebase upstream/main，处理冲突
```
你的改造都在 `custom` 分支；`main` 跟踪上游，保持干净。

## 提交基线
```bash
git add dev.sh docker-compose.override.yml CUSTOMIZE.md
git commit -m "chore: 搭建前端二次改造开发工作流"
```
