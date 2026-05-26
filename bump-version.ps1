# bump-version.ps1
# Update ?v= di semua *.html berdasar hash isi config.js + app.js.
# Jalankan setiap kali habis edit config.js atau app.js sebelum deploy.

$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

$cfg = Join-Path $root "config.js"
$app = Join-Path $root "app.js"
foreach ($p in @($cfg, $app)) {
  if (-not (Test-Path $p)) { throw "File tidak ditemukan: $p" }
}

# Hash gabungan biar perubahan di salah satu file menggeser version.
$hashCfg = (Get-FileHash -Path $cfg -Algorithm SHA1).Hash
$hashApp = (Get-FileHash -Path $app -Algorithm SHA1).Hash
$hashAll = (Get-FileHash -InputStream ([IO.MemoryStream]::new(
  [Text.Encoding]::ASCII.GetBytes($hashCfg + $hashApp)
)) -Algorithm SHA1).Hash
$ver = $hashAll.Substring(0, 10).ToLower()

$enc = New-Object System.Text.UTF8Encoding($false)
$pattern = '(<script src="(?:config|app)\.js)(?:\?v=[a-z0-9-]+)?(")'

$files = Get-ChildItem -Path $root -Filter *.html
foreach ($f in $files) {
  $src = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
  $new = [regex]::Replace($src, $pattern, "`$1?v=$ver`$2")
  if ($new -ne $src) {
    [System.IO.File]::WriteAllText($f.FullName, $new, $enc)
    Write-Host "  bumped $($f.Name) -> ?v=$ver"
  } else {
    Write-Host "  skip   $($f.Name)"
  }
}

Write-Host "`nVersion: $ver"