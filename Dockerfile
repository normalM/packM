FROM golang:1.17 AS build

WORKDIR /build


COPY go.mod .
# COPY ./src ./src

RUN GOCACHE=OFF
RUN go mod tidy
RUN go mod download
RUN go get -u github.com/gopherjs/gopherjs 
CMD ["sh","-c", \
    "CGO_ENABLED=0 GOOS=js GOARCH=wasm go build -o ./dist/server/go.wasm ./src/server/ \
    && GOOS=linux gopherjs build -o ./dist/client/go.js ./src/client/   \
    && sed -i '1ivar require = null\n' ./dist/client/go.js \
    && rm ./dist/client/go.js.map " ]

