# packM 🧬

packM 🧬 is fivem resource compiler for golang ,typescript with the power of golang+typescript compiler+webpack

#### How to
```console
git clone https://github.com/normalM/packM.git {project-name}
cd {project-name}

# rename name on package.json to {project-name}
code package.json
# rename name on go.mod to {project-name}
code go.mod
```
packM require [packM_builder](https://github.com/normalM/packM_builder) for auto build project
#### On Server

> support golang and typescript

#### On Client

> support typescript
>
> support golang [#gopherjs](https://github.com/gopherjs/gopherjs) (need [docker](https://www.docker.com/products/docker-desktop) to build)
#### On Shared
> support typescript
#### Status

> ready for make project

##### TODO
-   [x] support golang on client (with gopherjs but only work on linux build host such as wsl2, docker, etc...)
-   [ ] packM-cli is CLI for initialize, compiler project anywhere
-   [x] [packm.config.js](/packm.config.js) config project in one file
-   [x] [packM_builder](https://github.com/normalM/packM_builder) fivem resource for auto build packM on file change

Discord [@New Normal City](https://discord.gg/Sagt9MEMq6)
