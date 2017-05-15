FROM resin/raspberrypi3-node:7.2.1

WORKDIR /opt/agile-idm-web-ui
COPY . /opt/agile-idm-web-ui
RUN npm install
WORKDIR /opt/agile-idm-web-ui/
RUN npm install
EXPOSE 3000
ENV DEBUG_IDM_WEB 1
ENV DEBUG_IDM_CORE 1
CMD ./Start.sh
