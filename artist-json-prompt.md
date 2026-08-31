# Artist JSON generator prompt

Reusable prompt for generating artist upload JSON for [adminArtistJsonUpload.tsx](src/components/modules/admin/artist/adminArtistJsonUpload.tsx).

```
Generate artist JSON for: {ARTIST}

Look up the real band/artist on Wikipedia (or Discogs/RYM/Metal Archives if Wikipedia lacks it): formation year, origin (city, state/country), a short factual bio, the current lineup with instruments, and the full former-members list with instruments.

Output ONE JSON object matching this shape (matches artistCreateSchema in src/data/artistSchema.ts, strict - no extra keys):

{
  "artist": string,        // display name exactly as the band writes it, e.g. "The Faceless"
  "bio": string,           // 2-4 sentences: formation, style, notable releases, current status. Plain prose, no markup
  "location": string,      // "City, ST" for US, "City, Country" otherwise, e.g. "Encino, CA" / "Gothenburg, Sweden"
  "media": [""],           // always empty string, placeholder
  "members": [{ "name": string, "roles": [string, ...], "notes"?: string }],
  "formerMembers": [{ ... }]  // same shape; omit key entirely if the artist never had a lineup change
}

Note: "id" is not part of the payload - the slug is generated server side from "artist".
Solo artists still use "members" with a single entry.

Role/notes convention (matches existing DB data, see Role type in src/types/album.ts):
- Does not need to match, if it doesn't match use as is but if its close enough to a Role swap it with the Role
- Roles are short Title Case labels: "Vocals", "Guitar", "Lead Guitar", "Rhythm Guitar", "Bass", "Drums", "Keyboards" - not "Guitars"/"Drumming"/"Vocalist".
- One entry per person, all their instruments in "roles", e.g. ["Lead Guitar", "Clean Vocals", "Keyboards"].
- Tenure goes in "notes" as a year range: 2004-2012, or 2010-2013, 2019-present - never baked into the role string.
- Session/live-only players belong in "formerMembers" with notes "Live" or "Session", not in "members".
- Order "members" with founding/longest-tenured first, "formerMembers" newest departure first.

Reference types (src/types/album.ts) - update them, do not just report:
- Any role you use that is missing from the Role union gets added to it; Role stays grouped by kind (vocals, guitar, bass, drums, keys, strings/other, production, art) - put the new value in its group.
- Do not add a near-duplicate of an existing member ("Guitars" when "Guitar" exists) - normalize the JSON to the existing value instead.
- Add the artist's display name to the KnownArtist union in src/types/artist.ts, alphabetically, if missing.
- After editing, list what you added to which union.
Give me only the final JSON in a code block, ready to paste into the admin upload form.
```

## Example run - The Faceless

```json
{
  "artist": "The Faceless",
  "bio": "The Faceless is an American technical death metal band formed in Encino, California in 2004 by guitarist Michael Keene, the group's only constant member. Their sound moved from the death metal and deathcore of Akeldama (2006) toward the progressive, keyboard-heavy writing of Planetary Duality (2008) and Autotheism (2012). The band has cycled through a large number of vocalists, bassists and drummers between records.",
  "location": "Encino, CA",
  "media": [""],
  "members": [
    { "name": "Michael Keene", "roles": ["Lead Guitar", "Clean Vocals", "Keyboards"], "notes": "2004-present" }
  ],
  "formerMembers": [
    { "name": "Justin McKinney", "roles": ["Rhythm Guitar", "Lead Guitar"], "notes": "2013-2017" },
    { "name": "Geoff Ficco", "roles": ["Lead Vocals"], "notes": "2012-2014" },
    { "name": "Evan Brewer", "roles": ["Bass"], "notes": "2010-2013" },
    { "name": "Wes Hauch", "roles": ["Rhythm Guitar"], "notes": "2010-2013" },
    { "name": "Lyle Cooper", "roles": ["Drums"], "notes": "2007-2013" },
    { "name": "Derek Rydquist", "roles": ["Lead Vocals"], "notes": "2004-2012" },
    { "name": "Brandon Giffin", "roles": ["Bass"], "notes": "2006-2010" },
    { "name": "Steve Jones", "roles": ["Rhythm Guitar"], "notes": "2004-2007" }
  ]
}
```
