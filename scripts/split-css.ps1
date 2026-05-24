# Phase 2.1-2.4: split styles/legacy.css into tokens/reset/base + themes/* + layout/* + components/*.
# Section boundaries derived from the section-banner comments in legacy.css (verified 2026-05-24).
# Run once: pwsh -File scripts/split-css.ps1
# After main.css is verified, legacy.css is deleted (Phase 2.7).

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $root 'styles\legacy.css'
$out  = Join-Path $root 'styles'

if (-not (Test-Path $src)) { throw "legacy.css not found: $src" }
$lines = Get-Content -LiteralPath $src -Encoding UTF8

function Slice([int]$a, [int]$b) { return $lines[($a - 1)..($b - 1)] }

function Write-Section {
    param(
        [string]$Path,
        [string]$Banner,
        [int[]]$Ranges,
        [hashtable]$Replace = $null
    )
    $body = New-Object System.Collections.Generic.List[string]
    $body.Add('/* ============================================')
    $body.Add('   ' + $Banner)
    $body.Add('   Generated from styles/legacy.css by scripts/split-css.ps1.')
    $body.Add('   ============================================ */')
    $body.Add('')
    for ($i = 0; $i -lt $Ranges.Count; $i += 2) {
        foreach ($line in (Slice $Ranges[$i] $Ranges[$i+1])) { $body.Add($line) }
        if ($i + 2 -lt $Ranges.Count) { $body.Add('') }
    }
    $text = ($body -join "`r`n") + "`r`n"
    if ($Replace) { foreach ($k in $Replace.Keys) { $text = $text.Replace($k, $Replace[$k]) } }
    $full = Join-Path $out $Path
    New-Item -ItemType Directory -Force -Path (Split-Path $full) | Out-Null
    [System.IO.File]::WriteAllText($full, $text, (New-Object System.Text.UTF8Encoding($false)))
    '{0,6} lines -> styles/{1}' -f $body.Count, $Path
}

# ---- tokens / themes / reset / base ----
Write-Section -Path 'tokens.css' -Banner 'Design tokens (dark defaults + high-contrast)' `
    -Ranges @(7,68, 1914,1922)

Write-Section -Path 'themes/dark.css' `
    -Banner 'Dark theme (default; tokens live in tokens.css)' -Ranges @()

Write-Section -Path 'themes/light.css' -Banner 'Light theme token overrides' `
    -Ranges @(70,111) -Replace @{ 'body.light-theme {' = ':root[data-theme="light"] {' }

Write-Section -Path 'reset.css' -Banner 'CSS reset + base body' -Ranges @(113,129)

Write-Section -Path 'base.css'  -Banner 'App container shell' -Ranges @(131,137)

# ---- layout ----
Write-Section -Path 'layout/toolbar.css' -Banner 'Toolbar + mode toggle + language selector' `
    -Ranges @(139,355, 2247,2290, 2291,2338)

Write-Section -Path 'layout/sidebar.css' -Banner 'Sidebar (resize handle + activity bar + panels)' `
    -Ranges @(1046,1198)

Write-Section -Path 'layout/footer.css' -Banner 'Status bar (legacy + VS Code style)' `
    -Ranges @(607,839)

# ---- components ----
Write-Section -Path 'components/editor.css' -Banner 'Editor area + grid editor + scrollbars' `
    -Ranges @(356,508, 1924,2153, 2215,2246)

Write-Section -Path 'components/syntax.css' -Banner 'Syntax highlighting (legacy + grid)' `
    -Ranges @(509,606, 2154,2214)

Write-Section -Path 'components/toast.css' -Banner 'Toast notifications' -Ranges @(840,875)

Write-Section -Path 'components/modal.css' -Banner 'Modals + responsive + a11y focus rings' `
    -Ranges @(876,1006, 1007,1033, 1034,1045)

Write-Section -Path 'components/keywords.css' -Banner 'Keyword groups + buttons' `
    -Ranges @(1199,1297)

Write-Section -Path 'components/file-tree.css' -Banner 'File browser + open-local-file panel' `
    -Ranges @(1298,1416, 2943,3134)

Write-Section -Path 'components/shared-files.css' -Banner 'Shared files browser' `
    -Ranges @(1417,1718)

Write-Section -Path 'components/collaboration.css' -Banner 'Collaboration cursors + remote highlight' `
    -Ranges @(1719,1877, 1878,1891, 1892,1912)

Write-Section -Path 'components/viewers.css' -Banner 'PDF + Markdown viewers + laser pointers + MD controls' `
    -Ranges @(2339,2369, 2370,2394, 2395,2493, 2494,2643, 2644,2684, 2685,2708)

Write-Section -Path 'components/role-visibility.css' -Banner 'Student/Teacher only elements' `
    -Ranges @(2709,2724)

Write-Section -Path 'components/reactions.css' -Banner 'Emoji reactions' -Ranges @(2725,2771)

Write-Section -Path 'components/session.css' -Banner 'Session timer + offline indicator + student list' `
    -Ranges @(2772,2798, 2799,2836, 2837,2942)

Write-Section -Path 'components/lobby.css' -Banner 'Lobby overlay + classroom controls' `
    -Ranges @(3135,3349, 3350,3477)

'done.'
