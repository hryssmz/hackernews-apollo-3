# README

## 1. Setup

---

### 1.1. Initialize Project

---

```bash
mkdir hackernews-apollo-3
cd hackernews-apollo-3/
npm init -y
```

### 1.2. Development Dependencies

---

#### 1.2.1. TypeScript

---

```bash
npm install -D ts-node @types/node
# npx tsc --init
```

#### 1.2.2. Prettier

---

```bash
npm install -D prettier prettier-plugin-sh
```

#### 1.2.3. ESLint

---

```bash
# npm install -D eslint eslint-config-prettier
npm init @eslint/config
npm install -D eslint-config-prettier
```

```log
$ npm init @eslint/config
Need to install the following packages:
  @eslint/create-config
Ok to proceed? (y) y
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · commonjs
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · node
✔ What format do you want your config file to be in? · JavaScript

Local ESLint installation not found.
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest
✔ Would you like to install them now with npm? · No / Yes
Installing @typescript-eslint/eslint-plugin@latest, @typescript-eslint/parser@latest, eslint@latest

added 129 packages, and audited 149 packages in 5s

34 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Successfully created .eslintrc.js file in /home/hryssmz/projects/hackernews-graphql/hackernews-node
```

### 1.3. Initialize Express Project

---

#### 1.3.1. Express

---

```bash
npm install express
npm install -D @types/express
```

#### 1.3.2. Prisma Client

---

```bash
npm install @prisma/client
npm install -D prisma
```

#### 1.3.3. Apollo Server Express

---

```bash
npm install apollo-server-express apollo-server-core graphql
```

#### 1.3.4. BcryptJS

---

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

#### 1.3.5. JsonWebToken

---

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```
