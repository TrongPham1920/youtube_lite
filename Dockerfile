# 1. Base image
FROM node:20

# 2. Tạo thư mục làm việc trong container
WORKDIR /usr/src/app

# 3. Copy package.json & package-lock.json vào container
COPY package*.json ./

# 4. Cài đặt dependencies
RUN npm install

# 5. Copy toàn bộ mã nguồn vào container
COPY . .

# 6. Expose port (tuỳ theo app bạn, ví dụ thường là 3000)
EXPOSE 5000

# 7. Lệnh chạy app
CMD ["node", "src/index.js"]
