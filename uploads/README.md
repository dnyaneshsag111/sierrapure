# Sierra Pure — Local Image Uploads

This folder stores all uploaded images locally during development.

## Structure

```
uploads/
  bottles/    → 200ml, 500ml, 1000ml bottle product images
  clients/    → client logo images (Taj, Marriott, etc.)
  logo/       → Sierra Pure brand logo variants (primary, white, dark)
```

## Notes

- **Not committed to git** — actual image files are in `.gitignore`
- **Folder structure is committed** via `.gitkeep` files
- **Production** → swap `ImageStorageService` to use Cloudinary (config already in `application.properties`)
- **Upload API** → `POST /api/v1/images/bottles`, `/clients/logo`, `/sierra-logo`
- **Serve API** → `GET /api/v1/images/bottles/{filename}`, etc.

## Upload Directory Config

Configured in `src/main/resources/application.properties`:
```
app.upload.dir=${user.dir}/uploads
app.upload.bottles-dir=${user.dir}/uploads/bottles
app.upload.clients-dir=${user.dir}/uploads/clients
app.upload.logo-dir=${user.dir}/uploads/logo
```

`${user.dir}` = the project root directory (where you run `./mvnw`).
