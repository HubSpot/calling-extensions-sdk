<!-- Please create this PR as a draft and fill out this template before marking it as "Ready for review" so that the Calling Dev Integrations FE team can be automatically notified properly. -->
## Description
<!-- A clear and concise description of what the pull request is solving. -->

<!-- ### GitHub Issue -->

<!-- ### Before-and-After Screenshots -->

<!-- ### Relevant Links -->

## Testing
<!-- Please provide reproducible step-by-step instructions. -->

<!-- Can these be tested using the demo application?  -->

## Merge Checklist
- [ ] Does not introduce new console warnings
- [ ] Adds/refactors unit tests
- [ ] Adds/refactors integration tests
- [ ] Adds/refactors acceptance tests
- [ ] Adds documentation


## BRAVE Checklist

<!--

In order to ensure changes can be rolled out safely, effeciently and without fear, we ask that you go through the BRAVE checklist.

Each of the following sections will ask a series of questions which you should consider and provide (written) answers to. In some cases the answers may be simple, but writing them down helps to share context with reviewers.

The questions provided here are not exhaustive, they are intended as a starting point. You will need to consider the specifics of your system and changes.

-->

### Backwards Compatibility

<!--

Is this change backwards compatible with existing code? This should include existing backend clients, frontend application, external integrations, etc.

NOTE: You should aim to ensure backwards compatibility even if you intend to deploy all related code at the same time! Deploys at HubSpot are never atomic.

-->

### Rollout Plan

<!--

How will this change be rolled out? Do clients need to be updated? Does this change require a migration?

If something goes wrong with this change, can it be rolled back?

If your rollout or rollback plan requires special steps other than just deploying, please detail those steps here (ideally with links to related config options, gates, etc.)

A simple example of a rollout and rollback plan is provided below.

-->

### Automated Testing

<!--

Are there sufficient existing automated tests (either unit, integration or acceptance tests) that cover this functionality?

Refactoring untested code is inherently risky. If there are not sufficient existing tests, please add tests to cover existing behavior before making changes.

-->

### Verification

<!--

How will we manually verify that this change works (in addition to automated tests)?

If manual verification discovers issues not already covered by tests, please add tests to this PR to cover those cases.

-->

##### *REMINDER*: You should re-verify this PR after any changes are made due to PR comments.

### Expect Dependencies to Fail

<!--

Does this PR introduce new external dependencies (a database, another HTTP service, etc.)?

How will the application behave should one of those dependencies fail?

Do we need to implement better error handling or graceful failure?

Have you considered an acceptance-test or unit-test mocking dependencies and having them stall or return fuzzed results (different default values for optionals) to detect potential failures before PROD?
-->

##### *REVIEWERS*: In addition to reviewing the code of this PR, please read the answers above and validate that the code matches the expectations for BRAVE.
