# Kyle Board

Live board messaging thing. Using this project to experiment with integrating more complex backend systems (scale out, load balancing, ddos mitigation, etc.) which means the front end is going to be relatively basic.

## Todo

-   anti nsfw (ml stuff and other libraries)
-   oauth? (if it's free)
-   anti spam and ddos (cloudflare, hcaptcha, and server ratelimits)
-   load balancing (docker swarm)

## Lower Priority Todo (i.e. fix in next project lol)

-   find a way to cache images to local storage, resetStore() refetches ALL images which kills my limits on backblaze (not sure where this happens in the stack, nextjs frontend maybe?)
-   paginate search results
-   rate limit searchs
-   press tab in url to auto search (like in twitter.com and jisho.org)
-   test overflow for profile picture search results
-   upload custom profile picture

## Done

-   live updates (socket io)
-   standardize input validation on backend (dunno figure out smthn lol) (ended up using yup)
-   login, register, and forgot password system
-   image uploading (backblaze)
-   lightbox preview for images (probs just stick in a prebuilt package or smthn)
-   FTS (postgres)
-   CI/CD (auto deploy dockerfile via github integration in heroku)

## Bugs

-   logging out in different tab doesn't logout all tabs

## Misc

-   argon2 v0.28 on docker requires GLIBC_2.25 and docker doesn't have that installed? Sticking with v0.27.2 for now
-   cookies won't work when testing docker containers locally (intentional behavior but maybe doesn't have to be? don't know)

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
