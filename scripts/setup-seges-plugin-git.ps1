[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$expectedName = 'seges-plugin'
$expectedEmail = 'seges-plugin@users.noreply.github.com'
$repoRoot = (git rev-parse --show-toplevel).Trim()

git config --local user.name $expectedName
git config --local user.email $expectedEmail
git config --local user.useConfigOnly true
git config --local core.hooksPath '.githooks'
git config --local credential.helper '!gh auth git-credential'

Write-Output "Configured $repoRoot for $expectedName. Use scripts/commit-as-seges-plugin.ps1 for every commit."
