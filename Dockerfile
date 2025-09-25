# Sử dụng image Node.js 20 alpine làm base image
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file yarn.lock và package.json
COPY package.json yarn.lock ./

# Cài đặt các phụ thuộc bằng Yarn
RUN yarn install --frozen-lockfile

# Sao chép toàn bộ mã nguồn dự án
COPY . .

# Xây dựng ứng dụng Next.js
RUN yarn build

# Expose cổng mặc định của Next.js
EXPOSE 3000

# Lệnh để chạy ứng dụng Next.js trong môi trường sản xuất
CMD ["yarn", "start"]