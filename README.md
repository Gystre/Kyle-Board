# Kyle Board

Live board messaging thing. Using this project to experiment with integrating more complex backend systems (scale out, load balancing, ddos mitigation, etc.) which means the front end is going to be relatively basic.

![really cool picture of the website](https://cdn.discordapp.com/attachments/200994742782132224/973335561530138634/unknown.png)

## Todo ❌

-   anti nsfw (ml stuff and other libraries)
-   oauth? (if it's free)
-   anti spam and ddos (cloudflare ✔️, hcaptcha ✔️, and server ratelimits for searchs and posts [do this at the graphql level] ❌)

## Lower Priority Todo (i.e. fix in next project lol) ⚠️

-   find a way to cache images to local storage, resetStore() refetches ALL images which kills my limits on backblaze (not sure where this happens in the stack, nextjs frontend or cloudflare cdn or maybe browser level local storage?)
-   insert emitted post DIRECTLY into cache instead of invalidating the whole thing when someone posts something (HIGH PRIORITY)
-   paginate search results
-   press tab in url to auto search (like in twitter.com and jisho.org)
-   test overflow for profile picture search results
-   upload custom profile picture
-   load balancing (not possible on heroku)
    -   I was hoping to be able to use something that like nginx, docker swarm, or kubernetes to scale out the app but heroku locks you to their home built scaling system. Will need to switch to a cloud vm provider or a different backend hosting service.
-   replies
-   upvote post
-   client dark mode (i really should have built the website around this to begin with)
-   stripe for payments (simple donate button or smthn)
-   compression for files

## Done ✔️

-   live updates (socket io)
-   standardize input validation on backend (dunno figure out smthn lol) (ended up using yup)
-   login, register, and forgot password system
-   image uploading (backblaze)
-   lightbox preview for images (probs just stick in a prebuilt package or smthn)
-   FTS (postgres)
-   CI/CD (auto deploy server with dockerfile via github integration in heroku and web with vercel github integration)
-   upload videos

## Bugs

-   logging out in different tab doesn't logout all tabs
-   new posts only appear on refresh while viewing user's profile
-   video embed for discord doesn't work, meta tags broken
-   no thumbnail for video tag on mobile

## Misc

-   argon2 v0.28 on docker requires GLIBC_2.25 and docker doesn't have that installed? Sticking with v0.27.2 for now
-   cookies won't work when testing docker containers locally (intentional behavior but maybe doesn't have to be? don't know)
-   common/dist isn't in gitignore b/c vercel doesn't know how to build it so i just package it in with each build
-   there is a `.env.local example` file inside of `web/` to avoid using the local env vars inside of the prod environment in vercel
-   random `docker-compose.yml` in case I ever want to deploy on vps and want to look into scaling out

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

Set admin via heroku cli

```
heroku pg:psql -c "update public.user set \"permissionLevel\"=1 where username='saist'" -a kyle-board
```
