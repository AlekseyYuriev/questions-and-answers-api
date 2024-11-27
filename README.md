<h1>Questions & Answers API</h1>
This is RESTful web service for questions & answers system (similar to stackoverflow.com). The application has 2 roles: admin and user.

<h2>1. Link to the task</h2>

[Technical requirements](https://docs.google.com/document/d/1h69_umHFTf2NsRTi1f_SO32O8yNCFIKu/edit?usp=sharing&ouid=105503312417725816508&rtpof=true&sd=true)

<h2>2. How to run the app</h2>

- Use docker-desktop as the app is dockerized
- `git clone https://github.com/AlekseyYuriev/questions-and-answers-api.git` - clone the repository (HTTPS)
- `docker-compose up --build` - build docker container
- `npm run docker` - to run migrations you should first connect to docker container
- `npm run migrate` - run the migrations inside docker container

Here is exemplary view of your .env file:

- `API_ENV=your environment`
- `API_PORT=your api PORT`

- `DATABASE_PORT=your database PORT`
- `DATABASE_MAPPED_PORT=your mapped PORT for docker container`
- `DATABASE_USER=your database user name`
- `DATABASE_PASSWORD=your database password`
- `DATABASE_HOST=postgres_db`
- `DATABASE_NAME=name for your database`

- `CACHE_URL=cache`
- `CACHE_HOST=cache`
- `CACHE_PORT=your PORT for cash database`
- `CACHE_PASSWORD=your password for cash database`

<h2>3. Additional features</h2>

- You can use HTTPYAC extension to send requests to the API from your IDE. Every module has `http` folder.
- You can find Swagger documentation visiting `http://localhost:3000/api`.
- You can find Compodoc documentation running command `npm run doc` and following the provided link.
