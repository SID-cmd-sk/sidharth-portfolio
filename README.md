# Sidharth Portfolio

## Media and certificate storage
- Project data is in `data/portfolio.json`.
- Put all project media files inside `data/media/`:
  - Photos: `data/media/photos/...`
  - Videos: `data/media/videos/...`
  - 3D Models (`.stl`, `.obj`, `.glb`, `.gltf`): `data/media/models/...`
  - Certificates: `data/media/certificates/...`
- In JSON, use either:
  - Relative file names like `photos/part-1.jpg` (auto-resolves to `data/media/...`), or
  - Full URLs (`https://...`) for hosted media.

## Certification image click
Each certification supports an optional `image` field:

```json
{
  "id": "c1",
  "name": "SOLIDWORKS API Professional (CSWP-API)",
  "issuer": "Dassault Systèmes",
  "level": "Professional",
  "image": "certificates/cswp-api.jpg"
}
```
