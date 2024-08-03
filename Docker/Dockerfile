
|- client/  # React 应用
|- server/  # Express 应用
|- package.json
|- package-lock.json
# 第一阶段：构建 React 客户端
FROM node:14-alpine AS build-client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client ./
RUN npm run build

# 第二阶段：构建 Express 服务器
FROM node:14-alpine AS build-server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server .

# 第三阶段：合并客户端和服务器构建结果
FROM node:14-alpine

# 创建应用目录
WORKDIR /app

# 复制服务器代码
COPY --from=build-server /app/server .

# 复制 React 应用构建的静态文件
COPY --from=build-client /app/client/build ./client/build

# 安装服务器端的 npm 依赖（不包含 dev 依赖）
RUN npm install --production

# 暴露端口
EXPOSE 3000

# 运行服务器
CMD ["npm", "start"]
