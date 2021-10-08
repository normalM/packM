# packM 🧬

packM 🧬 is fivem resource compiler for golang with the power of golang+typescript+webpack

```console
git clone https://github.com/normalM/packM.git {project-name}
cd {project-name}

# rename name on package.json to {project-name}
code package.json
# rename name on go.mod to {project-name}
code go.mod
yarn
yarn build
```

#### On Server

> support golang and typescript

#### On Client

> support typescript
>
> support golang (need docker to build)

#### Status

> ready for make project

##### TODO

-   [x] support golang on client (with gopherjs but only work on linux build host such as wsl2, docker, etc...)
-   [ ] packM-cli is CLI for initialize, compiler project anywhere
-   [ ] packm.json config project in one file
