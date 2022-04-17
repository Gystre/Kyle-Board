# Frontend

1. go to vercel
2. create project
3. connect github repo
4. set build & development settings to next.js defaults
5. go to settings and set root directory as `web`
6. go to environment variables
7. add `NEXT_PUBLIC_SERVER_URL` with value `https://kylegodly.com/`
8. add `NEXT_PUBLIC_API_URL` with value `https://api.kylegodly.com/graphql`
9. push commit to auto build + deploy

# Backend

Set these environment vars in heroku:

-   REDIS_URL (auto created w/ redis addon)
-   DATABASE_URL (auto created w/ postgres addon)
-   CORS_ORIGIN

1. set heroku app's stack to container: `heroku stack:set container --app kyle-board`
