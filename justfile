deploy:
  mdbook build
  git worktree add --orphan -B gh-pages gh-pages
  cp -r book/* gh-pages
  # git config user.name "Deploy from CI"
  # git config user.email ""
  cd gh-pages && git add -A && git commit -m 'deploy new book' && git push origin +gh-pages
  just clean
  # git worktree remove gh-pages --force

clean:
  git worktree remove gh-pages --force
