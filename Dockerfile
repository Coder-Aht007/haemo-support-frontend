FROM node:14-alpine 
WORKDIR /haemo_support_app
COPY package*.json ./
RUN npm install
COPY ./ ./
EXPOSE 3000
CMD ["npm", "start"]