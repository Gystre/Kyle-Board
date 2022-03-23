# Kyle Board

Live board messaging thing. Using this project to experiment with integrating more complex backend systems (scale out, load balancing, ddos mitigation, etc.) which means the front end is going to be relatively basic.

## Todo

-   FTS (postgres)
-   anti nsfw (ml stuff and other libraries)
-   oauth? (if it's free)
-   CI/CD (github actions to docker build on pc and pull on vm)
-   anti spam and ddos (cloudflare, hcaptcha, and server ratelimits)
-   load balancing (docker swarm)

## Done

-   live updates (socket io)
-   standardize input validation on backend (dunno figure out smthn lol) (ended up using yup)
-   login, register, and forgot password system
-   image uploading (backblaze)

## Bugs

-   deleting post created by socket deletes on server but not on client (write into apollo cache instead of creating manually)

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
