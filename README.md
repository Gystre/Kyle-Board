# Kyle Board

Live board messaging thing. Using this project to experiment with integrating more complex backend systems (scale out, load balancing, ddos mitigation, etc.) which means the front end is going to be relatively basic.

## Todo

-   CI/CD (github actions to docker build on pc and pull on vm)
-   load balancing (docker swarm)
-   FTS (postgres)
-   anti nsfw (ml stuff and other libraries)
-   anti spam and ddos (cloudflare, hcaptcha, and server ratelimits)
-   image uploading (backblaze)
-   oauth? (if it's free)

## Done

-   live updates (socket io)
-   standardize input validation on backend (dunno figure out smthn lol) (ended up using yup)
-   login, register, and forgot password system

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
