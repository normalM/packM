FROM golang:1.17 AS build

WORKDIR /build


COPY go.mod .
COPY ./src ./src

RUN GOCACHE=OFF
RUN go mod tidy
RUN go mod download
RUN go get -u github.com/gopherjs/gopherjs 

