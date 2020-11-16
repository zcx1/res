# RESUME
# Репозиторий только для резюме и будет удален.
## Подготавливаем систему
### Устанавливаем NodeJS
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash - 
apt install nodejs
```
### Устанавливаем yarn
```
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
apt update && apt install yarn
export PATH="$(yarn global bin):$PATH"
echo 'export PATH="$(yarn global bin):$PATH"' >> ~/.bashrc
```
### Устанавливаем vue cli
```
yarn global add @vue/cli
```
### Проверяем доступность vue cli
```
vue --version
```

## Команды для работы с проектом
### Запуск проекта
```
yarn install
```
### Компилирование проекта для dev
```
yarn serve
```
### Компилирование проекта для product
```
yarn build
```
### Lints and fixes files
```
yarn lint
```
### Запуск json сервера
```
yarn fake
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
