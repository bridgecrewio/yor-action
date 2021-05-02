FROM bridgecrew/yor:0.1.1

MAINTAINER bridgecrew.io

COPY entrypoint.sh /entrypoint.sh


# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]
