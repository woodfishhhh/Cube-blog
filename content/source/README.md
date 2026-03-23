# Local Source Mirror

This directory vendors the content that `3Dblog` needs at runtime and for local import tooling.

- `myblog/`
  Contains the mirrored note source previously read from the sibling `MyBlog` folder.
- `blog/`
  Contains the mirrored blog metadata and the raw source files still referenced by local import scripts.

The application should read from this directory tree instead of reaching into sibling folders.
