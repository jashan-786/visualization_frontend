# defineing local path of the repository

$repoPath= "D:\Porjects\visualization\visualization_frontend"

# NAvigate to the Git repository folder

Set-Location -Path $repoPath

# stage all cahnges

git add .

git commit -m "Auto -commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

git push origin main

