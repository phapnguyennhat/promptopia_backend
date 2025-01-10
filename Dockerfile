
FROM node:18-alpine  
# choose image node to run
 
WORKDIR /user/src/app
# where store source

COPY package.json package-lock.json ./
RUN npm ci --omit=dev
RUN npm install -g @nestjs/cli 
# install package dependency without devdependency
 
COPY . .
# copy all source to workdir
 
 
RUN npm run build
# build project
 
USER node
# avoid run as ad
 
CMD ["npm", "run", "start:prod"]
# after build image run this cmd