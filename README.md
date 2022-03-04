# Kyle Board

Live board messaging thing. Using this project to experiment with integrating more complex backend systems (scale out, load balancing, ddos mitigation, etc.) which means the front end is going to be relatively basic.

## Todo

-   CI/CD (github actions to docker build on pc and pull on vm)
-   load balancing (docker swarm)
-   FTS (postgres)
-   live updates (socket io)
-   anti nsfw (ml stuff and other libraries)
-   anti spam and ddos (cloudflare and hcaptcha)
-   image uploading (backblaze)
-   login, register, and forgot password system
-   oauth? (if it's free)
-   standardize input validation on backend (dunno figure out smthn lol)

#### Misc

Dump database schema

```
pg_dump -U postgres -s dbname > outputfile.db
```

Export Database

```
pg_dump dbname > outputfile.sql
```

Import Database

```
psql dbname < importfile.sql
```
