# Contribution Guidelines

First off, thank you for taking the time to contribute!🎉💪

The following is a set of guidelines for contributing. These are mostly
guidelines, not rules. Use your best judgment, and feel free to propose changes
to this document in a pull request.

## Table of contents

- [Contribution Guidelines](#contribution-guidelines)
  - [Table of contents](#table-of-contents)
  - [Why?](#why)
  - [Before Getting Started](#before-getting-started)
    - [Learn about our code of conduct](#learn-about-our-code-of-conduct)
    - [Learn about our contribution models](#learn-about-our-contribution-models)
    - [Got a Question or Problem?](#got-a-question-or-problem)
  - [Different contributions](#different-contributions)
    - [Found a bug?](#found-a-bug)
    - [Found a security vulnerability?](#found-a-security-vulnerability)
    - [Missing a Feature?](#missing-a-feature)
    - [Want to improve the documentation?](#want-to-improve-the-documentation)
  - [Submission Guidelines](#submission-guidelines)
    - [Submitting an Issue](#submitting-an-issue)
    - [Submitting a Pull Request (PR)](#submitting-a-pull-request-pr)
      - [OSS Model](#oss-model)
    - [Reviewing a Pull Request](#reviewing-a-pull-request)
  - [Your First Contribution](#your-first-contribution)

## Why?

Following these guidelines helps to communicate that you respect the time of the
developers managing and developing this open-source project. In return, they
should reciprocate that respect in addressing your issue, assessing changes, and
helping you finalize your pull requests.

## Got a Question or Problem?

If you have questions about this project please ask the question by submitting
an issue in this repository.

## Different contributions

There are many ways to contribute, from writing tutorials, improving the
documentation, submitting bug reports and feature requests, or writing code that
can be incorporated into the project itself.

### Found a bug?

If you find a bug in the source code or a mistake in the documentation, you can
help us by [submitting an issue](#submitting-an-issue) to our GitHub Repository.

### Found a security vulnerability?

If you find a significant vulnerability, or evidence of one, please report it
privately. Do not submit an issue, unless asked to.

Please see [security](SECURITY.md) for more information.

### Missing a Feature?

You can request a new feature by [submitting an issue](#submitting-an-issue) to
our GitHub Repository. If you would like to implement a new feature, please
consider the size of the change in order to determine the right steps to
proceed:

For a Major Feature, first, open an issue and outline your proposal so that it
can be discussed. This process allows us to better coordinate our efforts,
prevent duplication of work, and help you to craft the change so that it is
successfully accepted into the project.

Note: Adding a new topic to the documentation, or significantly re-writing a
topic, counts as a major feature.

Small Features can be crafted and directly submitted as a Pull Request.

### Want to improve the documentation?

If you want to help improve the docs, it's a good idea to let others know what
you're working on to minimize duplication of effort. Create a new issue (or
comment on a related existing one) to let others know what you're working on.

## Submission Guidelines

### Submitting an Issue

Before you submit an issue, please search the issue tracker, maybe an issue for
your problem already exists and the discussion might inform you of workarounds
readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we
need to reproduce and confirm it. In order to reproduce bugs, we require that
you provide minimal reproduction. Having a minimal reproducible scenario gives
us a wealth of important information without going back and forth with you with
additional questions.

A minimal reproduction allows us to quickly confirm a bug (or point out a coding
problem) as well as confirm that we are fixing the right problem.

We require minimal reproduction to save maintainers time and ultimately be able
to fix more bugs. Often, developers find coding problems themselves while
preparing a minimal reproduction. We understand that sometimes it might be hard
to extract essential bits of code from a larger codebase but we really need to
isolate the problem before we can fix it.

Unfortunately, we are not able to investigate/fix bugs without minimal
reproduction, so if we don't hear back from you, we are going to close an issue
that doesn't have enough info to be reproduced.

You can file new issues by selecting from our new issue templates and filling
out the issue template.

### Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search the GitHub Repository for an open or closed PR that relates to your
   submission. You don't want to duplicate existing efforts.

1. Be sure that an issue describes the problem you're fixing, or documents the
   design for the feature you'd like to add. Discussing the design upfront helps
   to ensure that we're ready to accept your work.

1. Fork the repository.

1. Make your changes in a new git branch:

   ```shell
   git checkout -b my-fix-branch main
   ```

1. Create your patch, include tests if necessary.

1. Ensure that all tests pass.

1. Commit your changes using a descriptive commit message.

   ```shell
   git commit --all
   ```

   Note: the optional commit `-a` command-line option will automatically "add"
   and "rm" edited files.

1. Push your branch to your GitHub fork:

   ```shell
   git push origin my-fix-branch
   ```

1. In GitHub, send a pull request to merge from the branch on your fork to the
   main branch in the upstream.

1. After your pull request is merged, make sure that your branch and/or fork are
   deleted.

### Reviewing a Pull Request

Anyone can review pull requests, we encourage others to review each other's
work, however, only the maintainers can approve a pull request. Pull Requests
often require several approvals from maintainers, before being able to merge it.

## Your First Contribution

Unsure where to begin contributing? You can start by looking through
good-first-issue and help-wanted issues: "Good first issue" issues - issues that
should only require a few lines of code, and a test or two. "Help wanted"
issues - issues that should be a bit more involved than good-first-issue issues.

Working on your first Pull Request? You can learn how from this _free_ series,
[How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).
If you prefer to read through some tutorials, visit
<https://makeapullrequest.com/> and <https://www.firsttimersonly.com/>

At this point, you're ready to make your changes! Feel free to ask for help;
everyone is a beginner at first :smile_cat:

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code
has changed and that you need to update your branch so it's easier to merge.
