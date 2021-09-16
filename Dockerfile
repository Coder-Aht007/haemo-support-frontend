FROM node:14-alpine 
WORKDIR /haemo_support_app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "start"]