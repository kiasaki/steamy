# steamy

_Steamy is a simple deployment solution that aim to be fast and real easy to use._

## introduction

**Steamy** is a complete solution for deployment. It doesn't try to replace or be opiniated about the tool you use to provision, start or monitor you app. It simply manages build artifacts, apps & their environments and deployments you make.

This project is composed of three sub-components:

- `steamy-ui` The user interface you as a human will interact with.
- `steamy-api` The place where all the state and history of you deployments is kept.
- `steamy-agent` The program that will on you target server ready to pull in new code when asked.
- `steamy-cli` A command line tool to access **steamy**'s information and trigger deploys (as an alternative to the UI).

## quick start

## concepts

**Steamy doesn't:**

- Chose what language you code in
- Enforce a load balancing solution
- Enforce a monitoring tool
- Enforce a way or stucturing you repo, have a monorepo with multiple apps? No problem.
- Support only a subset of hosting plaforms
- Support only a subset of operating system

**Steamy does:**

- Require an agent to run on your hosts
- Allow for deploying multiple apps on the same host
- Put you in control by making you write simple bash scripts
- Includes a beatiful UI to help you be in control of your deploments

### How does it work?

**1.**

First step is to have `steamy-{api,ui}` up and running somewhere you have access to.

**2.**

Next step you need to install `steamy-cli` on you local computer or on CI, anywhere you want to deploy from actually.

**3.**

As part of the firt time setup you'll need to tell **steamy** _how_ it can update you app once your new build is on server. This is done using _bash_ scripts that you hold to dearly in the `steamy` directory.

Here an example of what it could look like:

```
$ cat steamy/POST_DOWNLOAD
cd $BUILD_DIR
npm install

$ cat steamy/PRE_RESTART
aws elb deregister-instances-from-load-balancer --load-balancer-name my-app-lb --instances $HOST_ID
monit stop myapp

$ cat steamy/RESTART
rm /var/www/my-app
ln -s $BUILD_DIR /var/www/my-app
monit start myapp
response_code=$(curl -s -w "%{http_code}" http://localhost:8000/signin -o /dev/null)
if [ "$response_code" != "200" ]; then
    echo "Smoke test failed"
    exit 1
fi

$ cat steamy/POST_RESTART
aws elb register-instances-from-load-balancer --load-balancer-name my-app-lb --instances $HOST_ID
```

Here's the complete deploy cycle: `PRE_DOWNLOAD->[DOWNLOADING]->POST_DOWNLOAD->[STAGING]->PRE_RESTART->RESTARTING->POST_RESTART->[SERVING]`

**4.**

Now, the first item that comes into play is *"build"*, we need to create a new build and publish it to *steamy*.

You can do that like this:

```
$ steamy -publish \
  -version "my-app.20370101194712.a1b2c4d"
  -artifact "build/my-app.tar.gz" \
  -project "my-app" \
  -repo-url "git@domain.com/my-app.git" \
  -repo-name "my-app" \
  -repo-branch "feature/add-awesomeness" \
  -repo-commit "a1b2c4d..." \
  -publisher "user@domain.com"
```

Most of those fields are optional, and, adding them in can be gretly aleviated by the usage of a helper script like: [this one](https://github.com/kiasaki/steamy/blob/master/example-project/publish_build.sh).

The required params are `version`, `artifact` and a valid existing `project` name.

Where `artifact` is the path to a `.tar.gz` archive can hold anything, the only requirement being that the `steamy` folder is present at it's root.

_Example:_

```
$ tar tvf my-app-a1b2c3d.tar.gz
lib/my-app.jar
steamy/RESTARTING
steamy/POST_RESTART
```

**5.**

Next step is to start a deploy to an **environment** using the **build** you just created, kick back, and watch it progress.

## contributing

## license

See `LICENSE` file.
