FROM bridgecrew/yor:0.1.52

MAINTAINER bridgecrew.io

COPY entrypoint.sh /entrypoint.sh
RUN apk add bash

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]
