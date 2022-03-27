# Kyle Board

Live board messaging thing. Using this project to experiment with integrating more complex backend systems (scale out, load balancing, ddos mitigation, etc.) which means the front end is going to be relatively basic.

## Todo

-   FTS (postgres)
-   anti nsfw (ml stuff and other libraries)
-   oauth? (if it's free)
-   CI/CD (github actions to docker build on pc and pull on vm)
-   anti spam and ddos (cloudflare, hcaptcha, and server ratelimits)
-   load balancing (docker swarm)

## Lower Priority Todo (i.e. fix in next project lol)

-   find a way to cache images to local storage, resetStore() refetches ALL images which kills my limits on backblaze (not sure where this happens in the stack, nextjs frontend maybe?)

## Done

-   live updates (socket io)
-   standardize input validation on backend (dunno figure out smthn lol) (ended up using yup)
-   login, register, and forgot password system
-   image uploading (backblaze)
-   lightbox preview for images (probs just stick in a prebuilt package or smthn)

## Bugs

-   logging out in different tab doesn't logout all tabs

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
