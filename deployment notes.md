# Frontend

1. go to vercel
2. create project
3. connect github repo
4. set build & development settings to next.js defaults
5. go to settings and set root directory as `web`
6. go to environment variables
7. add `NEXT_PUBLIC_SERVER_URL` with value `https://api.kylegodly.com/`
8. add `NEXT_PUBLIC_GRAPHQL_URL` with value `https://api.kylegodly.com/graphql`
9. push commit to auto build + deploy

# Notes
- make sure that namecheap or wherever you registered ur domain uses the vercel NAMESPACES not the A record so that redirecting from kylegodly.com -> www.kylegodly.com works


# Backend

`heroku logs --tail -a kyle-board`

Set these environment vars in heroku:

-   REDIS_URL (auto created w/ redis addon)
-   DATABASE_URL (auto created w/ postgres addon)
-   PORT (auto created by heroku)
-   CORS_ORIGIN

1. go into `server/index.ts` and inside `app.use` change cors urls to urls that point to server
2. set heroku app's stack to container: `heroku stack:set container --app kyle-board`
3. set heroku app's stack to container: `heroku stack:set container --app kyle-board`
4. go to addons and add heroku-postgresql and heroku-redis
5. add `https://api.kylegodly.com` to custom domains

## while github heroku integration is down

https://devcenter.heroku.com/articles/container-registry-and-runtime

1. heroku container:push web
2. heroku container:release web


