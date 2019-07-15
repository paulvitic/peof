## build stage
FROM alpine AS base
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    apk add --no-cache curl wget

## build the go executable
FROM golang:1.11 AS go-builder
COPY ./src/organization.peof /go/src/organization.peof
RUN cd /go/src/organization.peof && \
    go get ./... && \
    CGO_ENABLED=0 GOOS=linux go build -a -ldflags '-extldflags "-static"' -o /organization

## final stage
FROM base
ENV WEBROOT web
COPY --from=go-builder /organization /app/organization
COPY ./properties.json /app/properties.json

WORKDIR /app
#RUN chmod +x ./organization
CMD ["./organization"]

EXPOSE 3001
