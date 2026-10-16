# OpenAI ChatGPT listing readiness

Status checked: 2026-10-16

This document separates source-package preparation from OpenAI's remote MCP scan,
review, approval, and publication. The repository's v1.2.20 GitHub source release
does not mean the plugin has been submitted to, approved by, or published in the
ChatGPT directory.

The v1.2.21 listing-preparation package remains a historical candidate and is
not the current source state. The v1.2.22 edits below are not part of the
existing GitHub tag/release and have not been packaged or published. Do not move
or rewrite the existing `v1.2.20` tag.

## v1.2.21 local package acceptance

- Source commit `48b604cb5aad4c341af1a120f3e7bcd549b17ac7` is pushed to `main`; CI run `38834417295` passed.
- All package manifests now agree on version `1.2.21`.
- `npm test` passes: 62 public files, 14 root skills, and the expected 34-tool,
  18-prompt live catalog contract.
- The curated candidate ZIP was built twice with the official local packager;
  both files had the same SHA-256:
  `64f3221d83ff4a95c607d46b15a24f7ed54bc75f5173aeeef70693b90d4cde56`.
- The expanded ZIP passed the Linux validator: 40 files, 14 skills, zero
  errors. It retains one warning to confirm that no internal-only capabilities
  are included. The source was curated to public manifests, public MCP
  configuration, the 14 advertised skills, public brand assets, README, and
  license; the warning still needs publisher review.
- Directory listing pack generation reports `listing_ready`, zero missing
  fields, and one warning that `developerName` must match the identity verified
  in OpenAI's portal.
- Candidate artifact:
  `Noesis-Psychology-1.2.21-OpenAI-candidate-20261016.zip`.

These local checks do not include importing or scanning the ZIP in the OpenAI
portal, verifying publisher identity or domain, an authenticated production
tool scan, demo access, execution of all reviewer cases, approval, or
publication. The ZIP is a submission candidate, not proof of acceptance.

## v1.2.22 source changes (not packaged)

- All manifests/package metadata now target `1.2.22` for the optional profile-candidate preview workflow.
- The OpenAI release notes and canonical memory-distillation instructions make the preview explicitly opt-in,
  callable-tool-dependent, evidence-grounded, pending-review, and non-persistent.
- `npm test` must pass before building a new ZIP. The existing v1.2.21 ZIP and its hash above do not include these edits.
- No claim is made that `psychology_prepare_profile_candidate_preview` is present in production or accepted by ChatGPT.

## Prepared in source

- Both OpenAI-facing manifest interfaces use a short description within the
  30-character limit and the canonical `Productivity` category.
- The root manifest contains five positive and three negative reviewer test
  cases, plus source-release notes for v1.2.20.
- Positive cases name the expected MCP tools and observable behavior. They are
  proposed reviewer scenarios, not evidence that those cases have been run.
- The npm package file allowlist includes the portable root manifests and the
  Codex manifest. Use a curated OpenAI ZIP and inspect its contents; do not treat
  `npm pack` output as an OpenAI submission artifact.

## Remaining portal and human gates

The following have not been completed or verified in the OpenAI developer
portal:

1. Create and inspect the curated ZIP in the portal; confirm manifest import,
   package file paths, asset resolution, and all bundled skill safety/security
   scans.
2. Verify the developer/business identity, select the correct publisher
   identity, confirm the required organization permissions, and complete the
   portal policy attestations.
3. Connect the production MCP endpoint, complete the portal-generated domain
   challenge on the eligible Noesis host, and pass domain verification.
4. Run a successful current production tool scan. Review every exposed tool's
   `readOnlyHint`, `openWorldHint`, and `destructiveHint` values and provide a
   justification for each annotation in the portal.
5. Complete OAuth review access using a dedicated reviewer account with
   synthetic/sample data. Enter its credentials and instructions only in the
   portal's secure review-details form, not in this repository or ZIP. Ensure
   access works without MFA approval, email/SMS codes, magic links, or private
   network access.
6. Record an accessible demo video showing the main supported workflows and
   tools. No demo URL is included here because no recording has been provided
   or verified.
7. Run the five positive and three negative cases against the connected
   production service and reviewer account; confirm the actual tool calls and
   observable results match these proposed cases.
8. Choose publication country availability and listing translations in the
   package/portal, submit the draft for review, and address any review feedback.
   Approval and publication are separate portal actions.

## Current boundary

The repository test and `/info` catalog check do not perform portal import,
skill scans, authenticated OAuth, domain verification, a production tool scan,
or reviewer-case execution. Marketplace submission, acceptance, and publication
must not be reported as complete until their respective portal states are read
back successfully.
