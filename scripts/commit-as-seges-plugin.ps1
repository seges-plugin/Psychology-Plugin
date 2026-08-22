[CmdletBinding()]
param(
  [switch]$Push
)

$ErrorActionPreference = 'Stop'
$expectedName = 'seges-plugin'
$expectedEmail = 'seges-plugin@users.noreply.github.com'

if ((git config --local user.name).Trim() -ne $expectedName -or (git config --local user.email).Trim() -ne $expectedEmail) {
  throw 'Run scripts/setup-seges-plugin-git.ps1 before committing.'
}
if ((git config --local core.hooksPath).Trim() -ne '.githooks') {
  throw 'The required local hooks are not configured. Run scripts/setup-seges-plugin-git.ps1.'
}
if (git diff --cached --quiet) {
  throw 'Stage only the named, reviewed files before using this command.'
}

$node = Get-Command node -ErrorAction SilentlyContinue
if ($null -eq $node) {
  throw 'Node.js is required to run the plugin contract gate.'
}
& $node.Source scripts/verify-plugin-contract.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$messagePath = Join-Path ([System.IO.Path]::GetTempPath()) ("seges-plugin-empty-{0}.txt" -f [guid]::NewGuid().ToString('N'))
[System.IO.File]::WriteAllBytes($messagePath, [byte[]]@())
try {
  git commit --allow-empty-message "--file=$messagePath"
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
  if (Test-Path -LiteralPath $messagePath) {
    [System.IO.File]::Delete($messagePath)
  }
}

if ($Push) {
  git push
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
