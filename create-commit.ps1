
For ($i=0; $i -le 10; $i++) {

echo 1 >> test

git add --all 
git commit -m "added test"

rm 1

git add --all
git commit -m "removed test"

}