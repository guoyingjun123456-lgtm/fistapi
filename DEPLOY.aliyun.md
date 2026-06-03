# 阿里云 ECS 部署指南（FirstAPI / 基于 new-api）

> 本文解决在阿里云 Linux 服务器上部署本项目时最常见的两个坑：
> ① 基础镜像/依赖拉取慢；② 部署出来却是官方 New API 页面而非 FirstAPI。
>
> ⚠️ 本地 Windows + Docker Desktop 上构建需要的 `--build-arg HTTP_PROXY=...`（VPN 代理）
> **只在那台 Windows 机器上需要，绝不要带到阿里云服务器**——服务器是 Linux 原生 Docker，
> 没有 WSL2 虚拟网络那层问题，也没有那个 VPN 端口。

---

## 0. 前提

- 一台阿里云 ECS，Linux（Ubuntu/Debian/AlmaLinux 均可），建议 ≥ 2C4G、≥ 20G 磁盘
- 已安装 Docker（含 compose 插件）：`docker -v && docker compose version`
- 安全组放行 **3000** 端口（或仅放行 80/443 + 用 nginx 反代，见第 6 节）

## 1. 配置 Docker 国内镜像加速（解决基础镜像拉取慢）

构建用到的基础镜像（`oven/bun`、`golang`、`debian`）来自 Docker Hub，国内云服务器直连常被限速。
配置阿里云专属加速器（控制台 → 容器镜像服务 ACR → 镜像工具 → 镜像加速器，复制你的专属地址）：

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json >/dev/null <<'EOF'
{
  "registry-mirrors": [
    "https://<你的专属ID>.mirror.aliyuncs.com",
    "https://docker.m.daocloud.io"
  ]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

> apt 包（mirrors.aliyun.com）和 Go 模块（goproxy.cn）本身就是国内源，在阿里云上很快，无需额外配置。

## 2. 拉取代码

```bash
git clone https://github.com/youcaiyouaiwan123/112233.git
cd 112233
```

> 项目里 `docker-compose.override.yml` 已被跟踪，它会让 compose **用本地 Dockerfile 构建含 FirstAPI 前端的定制镜像**（而不是拉官方镜像）。

## 3. 部署：二选一

### 方式 A — 服务器上直接构建（简单，推荐先试）

```bash
docker compose up -d --build
```

- 首次会编译前端（bun）+ 后端（Go），约几分钟。
- **不要**加任何 `HTTP_PROXY` 参数。
- 若 `bun install` 拉 npm 依赖偏慢（npmjs.org 在海外），见「附录 A」配国内 npm 源。

### 方式 B — 本地/CI 构建好推镜像仓库，服务器只拉取（零构建、最省心）

适合服务器配置低、或不想在服务器上装构建依赖。

在能正常构建的机器（如本地 Windows，带其专用代理参数）或 GitHub Actions 上：

```bash
# 构建并打上 ACR 仓库标签（命名空间换成你自己的）
docker build -t registry.cn-hangzhou.aliyuncs.com/<命名空间>/firstapi:latest .
docker login registry.cn-hangzhou.aliyuncs.com
docker push registry.cn-hangzhou.aliyuncs.com/<命名空间>/firstapi:latest
```

服务器上：删除/改名 `docker-compose.override.yml`，把 `docker-compose.yml` 里的
`image: calciumion/new-api:latest` 改成你的 `registry.cn-hangzhou.aliyuncs.com/<命名空间>/firstapi:latest`，然后：

```bash
docker compose pull && docker compose up -d   # 只拉取，不构建
```

## 4. 验证

```bash
curl -s http://localhost:3000/api/status      # 应返回 {"data":...,"success":true}
```

浏览器访问 `http://<ECS公网IP>:3000`，标题应为 **FirstAPI**。首次默认管理员：`root` / `123456`。

## 5. ⚠️ 生产环境安全（务必修改）

`docker-compose.yml` 里所有密码默认都是 `123456`，公网部署前必须改：

- `POSTGRES_PASSWORD` 和 `SQL_DSN` 里的数据库密码（两处要一致）
- redis `--requirepass` 和 `REDIS_CONN_STRING` 里的密码（两处要一致）
- 登录后台后**立刻修改 root 管理员密码**
- 多节点/多容器部署时设置 `SESSION_SECRET`（随机字符串）
- 默认 postgres(5432)/redis(6379) 未对外暴露端口，**保持现状，别开放到公网**

## 6. （可选）域名 + HTTPS

用 nginx 反代到 `127.0.0.1:3000`，再用 Certbot 申请证书。安全组只放行 80/443，不直接暴露 3000。

## 7. 默认主题说明

本项目默认主题已设为 `default`（即 FirstAPI，见 `common/constants.go`、`setting/system_setting/theme.go`）。
- 想切回官方 New API 界面：后台「系统设置」切换为 `classic`，或在数据库 `options` 表 key=`theme` 改。

---

## 附录 A：bun 安装慢时配国内 npm 源（可选）

若方式 A 在服务器上 `bun install` 太慢，在 `Dockerfile` 两个前端构建阶段的 `RUN bun install` 前加一行：

```dockerfile
RUN bun config set registry https://registry.npmmirror.com
```

（仅加速，不改任何依赖版本。）

## 附录 B：跟进上游官方更新

```bash
git remote add upstream https://github.com/QuantumNous/new-api.git   # 已配置可跳过
git fetch upstream
git merge upstream/main      # 处理 web/default 等冲突，保留你的 FirstAPI 改造
docker compose up -d --build # 重新构建部署
```
