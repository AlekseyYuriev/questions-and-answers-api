<h1>Questions & Answers API</h1>
This is RESTful web service for questions & answers system (similar to stackoverflow.com). The application has 2 roles: admin and user.

<h2>1. Link to the task</h2>

[Technical requirements](https://drive.google.com/viewerng/thumb?ds=AEYuYPUs7j-Vo1-ufAqtR4dELs07age-ypA-aMbSgmFGmnsFhM22w_MSmCRirM7qFTcJqt2UtKtC5VG19ZWiKDNRY1t_AzU7-5AHlqfUYoM9-9tHKjZfW1bJ2NhyYBHJGKEOfWPgUWe6Pv9HpApipjkqsmfxBF4iv1o74DHkELC_n9VPBBImIrbMTDTb0MuMepKrDG7SVPzOAwgl0Vxyw2FO8bqrMHb2ra7br6xd-GcgH_CvKZTt3w2MoakUOcO_YL0jXRC7ejIsRmJAHtW4Z3jFs2NwbCwxdUiM60cTi66FiglX4BmfB3blLuLfmSlI1lu3IK_G6nrW5xDg90caVNsaYNO4dvkLQqeMn_X81i4-BCQ9hFl9YWleqVyt59g-mspW6LF8GqG2Ra4olTJTJy9XhBZ2WyWQeiqva1sHJpGPyxm-KgMCXp2IC9EcwpHdAJkCn7gw-mKcSUiLvUnUbsGlH5h7PHM6oSzLODRHfhm5tgAVM4TM3O_D432wCuKOK6H94Pb5yfBC4431uBKOQeizgppnLZV9y4JwMUCRXfHZnCRhFvs3XlJXOGM2gMG7H8tSFhXS4LSiVCslvGJwbpNJLUZf6iKI-RKE5z42CaMs4Plrws89X8qqMZbaP8ig09jHmOFi09Q9OeD1C8yNUQpTZbbjzY-IaqKRltGYpPxj87f5ETTVsuvmNm7hJ1iML0DVTb1DkWLNXdX3bP-11NzgXfqzOOBjUD20TqhlJhZkhotmE7DMyZAt6Bo9iW-JMcZ2UzA5Ulgybs1bZEbIigfnMQE7VZzcXcidXF7tzy8ysrLi814cDl-8X_bDdpa5R8E6vyR3E-UYahRsSyLc_CijOeihkRFvTj0FGDrCNkwVgFzllIMvdzRbZpCzXG-YbQlccD5r5OlJRQtR_K8N4Qtie8pL20iS-vkk7xD_DJPurCE-PVk_vyBnAzZjtvWWhQ5waITKVFvFZaenNKBmZzYyB-Fi28S_-FAXYhj-OcZXH3e4bxMFgBfn1UioB-xLLz730lc_5x3JlrSQPVAYi6fbuT-1UP6OZa2AAm_r8eITjK-r9pQnjg2hUbkrmE6MBiIkNtydvNc7-rfLdUvQobYNYZDsji0ycSo-8rmKYzJ9jl4ojgfcmcwh4A2Owaeus3NxFEWCpfL8nCESZW5D9Kq_zBJVI_ejhvclyeKhe8xSzAd-pypd3Vl9j1iBJAfdDE_ygVluwgmzXF8XbwwkAYkiJWNPegAtDyIkcymmrQPYekW8OBfu1X5bSehujYsguwNBgQL86xwuHBPRKiewHFeJiECdJtUemjeZTdbSusl84udQHQzWN839N41bZ_52cDx05Stq86PL5X23otfZy-dZDBgsvsYVco8UHaUXy2hRWvUmNNhWWonAGCOU9uydoj4pegW3ov4vN9nkU8cXYAe90caJhA6VPXUokofkLgmc6BejgnPD_HnZiatMGQkAfl-U0hakF542x5CiJU8Y4Qj4M0cpEnlWNGDzpQWQI4nSgSR00tZffSIMcWlIph-Dmral7o6UJR71aHK88DMquC4oeV5_W2rl3jRs36HTzoNTzhfLLKSjEhAK_-6hFHGAkyVGMLegt-sROdsnKDORkIUesMdl0uYgP4FrVZS_c_HGKSufu-aM3NbXauHg3bhnj7f_nlhQjrJgH4hgTztdCUm6_bbr3gsxoUVIMMI6UkbkoVYsaQEaXnObqENrj8VRZDin0fFcovZS3OemFfVZrtn6UQ4rT_9K-zuGhbXoTnoLabjKvDmX2dbcuuH1qI_TiP0YiIbpsFeZoTirMhMEH6q4FEHspPxEugmj3OhBgw97i44xprCY5mbJus8jdKk78xQqBedDMpweRXW4ir25psRBAhQLLh3_2uOgZpJqdnZgCEqKlRxxFhPcyPEGzv9pgeijfcg30mKu1zfQraeXlpaVULlMkJcHXN-cPqKNNNo2FoZD0S4rk6Qsssiy495-mXejhe1PxhQEBtg-i5Oks60XuaA7nsMM-QjquGz5PWnKFsUjUoYnxyjBYoBGhmiNY7TihMvktogaT4tz4Yz0ykWqq1q29zGbTJycHYPJdTLt6oaTsjAEuSmhuh3h2UGTegbBVg-7oYAm&ck=dynamite&authuser=0&w=512&p=proj)

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
