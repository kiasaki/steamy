# steamy

_Steamy is a deployment solution, it's simple & minimalistic making it quite flexible._

## introduction

**Steamy** is a complete solution for deployment. It doesn't try to replace or be opiniated about the tool you use to provision machines, monitor your app, build deployable artifacts, restart processes, or balance load. It simply creates builds for every push you make to SCM then allows you to deploy that build to any host with the `steamy-agent` installed via a nice user interface.

This project is composed of four sub-components:

- `steamy-ui` The user interface you as a human will interact with.
- `steamy-api` The place where all the state and history of you deployments is kept.
- `steamy-agent` The program that will on you target server ready to pull in new code when asked.
- `steamy-cli` A command line tool to access **steamy**'s information and trigger deploys (as an alternative to the UI).

## quick start

Assuming Ubuntu (Upstart as init really):

```
$ curl -o /usr/local/bin/steamy-api https://github.com/kiasaki/steamy/releases/download/v0.1.0/steamy-api
$ curl -o /usr/local/bin/steamy-ui https://github.com/kiasaki/steamy/releases/download/v0.1.0/steamy-ui
```

```
$ chmod +x /usr/local/bin/steamy-api
$ chmod +x /usr/local/bin/steamy-ui
```

```
$ cat <<EOT >> /etc/init/steamy-api.conf
start on runlevel [2345]
stop on shutdown
exec /usr/local/bin/steamy-api >/var/log/steamy-api.log
EOT
$ cat <<EOT >> /etc/init/steamy-ui.conf
start on runlevel [2345]
stop on shutdown
exec /usr/local/bin/steamy-ui >/var/log/steamy-ui.log
EOT
```

```
$ service steamy-api start
$ service steamy-ui start
```

At this point the UI should be available at `http://<server-ip>:9494/` given you have the right environment variables setup for `steamy-api` to connect to a postgres databe.

## concepts

**Steamy doesn't:**

- Enforce a specific language
- Enforce a specific load balancer
- Enforce a monitoring tool
- Enforce a specific cloud provider
- Enforce a specific operating system
- Enforce a way or stucturing you repo
- Require SSH access
- Require tons of setup

**Steamy does:**

- Work better with Git and GitHub
- Require an agent to run on your hosts
- Includes a beatiful UI to help you visualize and control deployments
- Allow for deploying multiple apps on the same host
- Allow for complex deployment/restart sequences by making you write plain bash

### How does it work?

**1. Steamy installation**

First step is to have `steamy-{api,ui}` up and running somewhere you have access to.

**2. Agent installation**

Next step you need to install `steamy-agent` on your taget hosts and specify the hosts **name** and **groups** in a config file.

_Make sure at least one host is in the `build` group as **steamy** will need at leat one machine to dispatch build tasks to._

**3. Create a new project**

Navigate to `http://<steamy-server-ip>:9494/projects/create` and create a new project specifying a build script and default deploy script.

**4. Add a webhook to you Github repo**

Follow instructions in [here](https://github.com/kiasaki/steamy/blob/master/docs/webhook-setup-github.md) so that **steamy** gets notified when you push new commits.

**5. Push code**

Push some new code to your repo and you should see a new build apear in your project.

**5. Deploy your new build to hosts**

Next step is to start a deploy you newly created **build** to an **environment**.

![After first push](https://github.com/kiasaki/steamy/blob/master/docs/images/readme-first-build.png)

## contributing

See the [contributing](https://github.com/kiasaki/steamy/blob/master/docs/contributing.md) file in the `docs/` folder.

## license

See `LICENSE` file.
