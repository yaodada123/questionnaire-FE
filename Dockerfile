# 使用官方的 Node.js 运行时镜像作为基础镜像
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果有）
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建 React 应用
RUN npm run build

# 使用 Nginx 作为生产服务器
FROM nginx:alpine

# 复制构建好的静态文件到 Nginx 的默认静态文件目录
COPY --from=build /app/build /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]