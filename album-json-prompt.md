# Album JSON generator prompt

Reusable prompt for generating album upload JSON for [adminAlbumJsonUpload.tsx](src/components/modules/album/admin/adminAlbumJsonUpload.tsx).

```
Generate album JSON for: {ARTIST} - {ALBUM}

Look up the real release on Wikipedia (or Discogs/RYM if Wikipedia lacks it): year, label, genre, total runtime, full track listing with per-track durations, and the full personnel/credits section (band members + instruments, guest musicians + which track they appear on, production credits).

Output ONE JSON object matching this shape (matches albumCreateSchema in src/data/albumSchema.ts, strict — no extra keys):

{
  "artist": string,
  "album": string,
  "year": number,
  "label": string,
  "genre": string,        // singular, pick the primary genre
  "runtime": string,      // "MM:SS" or "H:MM:SS" total
  "art": [""],               // always empty string, placeholder
  "personnel": {
    "members": [{ "name": string, "roles": [string, ...], "notes"?: string }],
    "guests": [{ ... }],     // omit key entirely if no guests
    "production": [{ ... }],
    "studios": [string, ...] // omit key entirely if unknown
  },
  "tracks": [
    { "number": number, "title": string, "duration": "M:SS", "instrumental"?: true }
  ]
}

Role/notes convention (matches existing DB data, see Role type in src/types/album.ts):
- Does not need to match, if it doesn't match use as is but if its close enough to a Role swap it with the Role
- Roles are short Title Case labels: "Vocals", "Guitar", "Bass", "Drums", "Producer", "Engineer", "Mixer", "Mastering Engineer" — not "Mixing"/"Mastering"/"Engineering".
- Guest vocalists get role "Guest Vocals", not plain "Vocals".
- Track-specific context (which song someone guests on, what they played where) goes in "notes" as: Appears on "Song Title" — never baked into the role string.
- A person can hold multiple roles if they did multiple jobs, e.g. ["Producer", "Engineer", "Mixer"].
- Self-produced-by-the-band credits use the band name as the "name" with roles ["Producer"].
Give me only the final JSON in a code block, ready to paste into the admin upload form.
```

## Example run — The Faceless — Autotheism

```json
{
  "artist": "The Faceless",
  "album": "Autotheism",
  "year": 2012,
  "label": "Sumerian Records",
  "genre": "Technical death metal",
  "runtime": "40:56",
  "art": [""],
  "personnel": {
    "members": [
      { "name": "Geoff Ficco", "roles": ["Lead Vocals"] },
      { "name": "Michael Keene", "roles": ["Lead Guitar", "Clean Vocals", "Keyboards"] },
      { "name": "Wes Hauch", "roles": ["Rhythm Guitar", "Lead Guitar"], "notes": "Lead guitar on \"Ten Billion Years\"" },
      { "name": "Evan Brewer", "roles": ["Bass"] },
      { "name": "Lyle Cooper", "roles": ["Drums"] }
    ],
    "guests": [
      { "name": "Sergio Flores", "roles": ["Saxophone"], "notes": "Appears on \"Autotheist (Movement III: Deconsecrate)\"" },
      { "name": "Tara Keene", "roles": ["Backing Vocals"], "notes": "Appears on \"Autotheist (Movement II: Emancipate)\"" }
    ],
    "production": [
      { "name": "Michael Keene", "roles": ["Producer", "Engineer", "Mixer", "Mastering Engineer"] },
      { "name": "Marcelo Vasco", "roles": ["Artwork"] },
      { "name": "Steve Jones", "roles": ["Additional Composition"], "notes": "Appears on \"Accelerated Evolution\"" }
    ],
    "studios": ["Keene Machine Studios (North Hollywood, CA)"]
  },
  "tracks": [
    { "number": 1, "title": "Autotheist (Movement I: Create)", "duration": "3:44" },
    { "number": 2, "title": "Autotheist (Movement II: Emancipate)", "duration": "7:20" },
    { "number": 3, "title": "Autotheist (Movement III: Deconsecrate)", "duration": "6:40" },
    { "number": 4, "title": "Accelerated Evolution", "duration": "4:39" },
    { "number": 5, "title": "The Eidolon Reality", "duration": "3:46" },
    { "number": 6, "title": "Ten Billion Years", "duration": "5:34" },
    { "number": 7, "title": "Hail Science", "duration": "0:53" },
    { "number": 8, "title": "Hymn of Sanity", "duration": "1:34" },
    { "number": 9, "title": "In Solitude", "duration": "6:27" }
  ]
}
```
