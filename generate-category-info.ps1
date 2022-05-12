param()

$global:ErrorActionPreference = 'Stop'

foreach ($EventFolder in (Get-ChildItem -Path $PSScriptRoot/docs/ossv1/blueprints/reference -Recurse -Filter event)) {
  Set-Content -Path "$($EventFolder.FullName)/_category_.json" -Value @"
{
  "label": "Events",
  "collapsible": true,
  "collapsed": false
}
"@
}

foreach ($EventFolder in (Get-ChildItem -Path $PSScriptRoot/docs/ossv1/blueprints/reference -Recurse -Filter function)) {
  Set-Content -Path "$($EventFolder.FullName)/_category_.json" -Value @"
{
  "label": "Functions",
  "collapsible": true,
  "collapsed": false
}
"@
}