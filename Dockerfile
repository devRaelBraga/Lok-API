FROM public.ecr.aws/docker/library/node:18-alpine

# Create app directory
WORKDIR /home/infratrack

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY *.json ./
COPY prisma ./prisma/
# COPY prisma ./prisma/

# Install app dependencies
RUN npm install

RUN npm run build

COPY . .

# RUN ls
# RUN pwd

# COPY ./node_modules ./node_modules
# COPY ./package*.json ./
# COPY ./dist ./dist

# RUN npm run build

# EXPOSE 3000
# CMD [ "npm", "run", "start:prod" ]