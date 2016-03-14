# Contributing

## Developing

You will need a recent `nodejs`, `go` and `postgresql` installed.

**1.**

Start by creating a DB for **steamy** in PostgreSQL by typing someting similar to the following in a `psql` session:

```sql
CREATE ROLE "steamy" WITH SUPERUSER LOGIN PASSWORD 'steamy';
CREATE DATABASE "steamy" WITH OWNER "steamy";
```

**2.**

Next, you can start **steamy-api** by running the following from the `steamy-api/` folder:

```
$ make && steamy-api
```

You should see the following apear:

> go build -o steamy-api .
> 2016/03/14 12:14:34 listening on port: 9484

**3.**

Last step is to start the **steamy-ui**, running the following from the `steamy-ui/` folder should do the trick:

```
$ webpack -w
```

_Don't forget to install the dependencies like so `npm i && npm i -g webpack` beforehand._

Now that will watch and compile our frontend's javascript bundle but we still need to serve the `index.html` and `app-bundle.js` somehow:

A simple PHP static server will do the trick (just make sure you have PHP >5.4 installed):

```
$ php -S localhost:9494
```
