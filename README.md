# Kuldeep.tech

My personal site, built using [Hugo](https://github.com/gohugoio/hugo) and hosted on [cloudflare pages](https://pages.dev) also on [GitHub Pages](https://pages.github.com/).

Address: <https://kuldeep.tech>

## Editing

Use the `new` command to create a new post:

```shell
# new posts
hugo new posts/my-first-post/index.md

# new posts with special category name as a prefix
hugo new posts/category/my-first-post/index.md
```

Launch a local Hugo server including live reload by running:

```shell
# serve in debug mode, with all drafts
hugo server --logLevel debug --buildDrafts --disableFastRender --bind 0.0.0.0

# serve in production mode
hugo serve -e production --disableFastRender

# or serve using the static files generated in production mode
# need to install caddy first
caddy file-server --root public/ --listen 0.0.0.0:8881
```
