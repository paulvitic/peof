## build stage
FROM alpine AS base
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    apk add --no-cache curl wget

## build the go executable
FROM golang:1.12 AS go-builder

ENV GO111MODULE=on

WORKDIR /app
COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o organization

## final stage
FROM base
COPY --from=go-builder /app/organization /app/organization
COPY ./properties.json /app/properties.json

WORKDIR /app

#RUN chmod +x ./organization
CMD ["./organization"]

EXPOSE 3001
