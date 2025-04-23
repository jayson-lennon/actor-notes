deploy:
  mdbook build
  git worktree add --orphan -B gh-pages gh-pages
  rsync -ahxv book/ gh-pages
  cd gh-pages && git add -A && git commit -m 'deploy new book' && git push origin +gh-pages
  just clean

clean:
  git worktree remove gh-pages --force
  git branch -D gh-pages
