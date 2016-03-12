# Build

Steamy's first stop for your code is it's build step. When a commit comes in,
a new job will be created on one of your hosts designated as "build capable".

The result of this step is a new build being created and it's artifacts (read
files and folders resulting from you building you app) archived along it.

This newly created build representing a specific commit from you SCM repo is
now deployable to any environment you have configured in your project.
