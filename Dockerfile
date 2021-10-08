FROM golang:1.17 AS build

WORKDIR /build

RUN GOCACHE=OFF

RUN ls 
RUN go mod tidy
RUN go mod download
RUN CGO_ENABLED=0 GOOS=js GOARCH=wasm go build -a -installsuffix cgo -o ./dist/server ./src/server


VOLUME . /build

# FROM alpine:latest

# RUN apk --no-cache add ca-certificates

# WORKDIR /app
# COPY --from=build /app/run .
# ENV TZ=Asia/Bangkok
# EXPOSE 5000
# CMD ["./run"]