## Mike Brucker

This is a readme that contains almost nothing useful


### Image Helpers
- All jpgs to webp
```
magick mogrify -format webp -quality 82 -define webp:method=6 *.jpg
```
- All pngs to webp
```
magick mogrify -format webp -define webp:lossless=true -define webp:method=6 *.png
```
- white logo fill with black background
```
magick LOGO.webp -alpha off \( +clone -colorspace gray -negate \) -compose CopyOpacity -composite -fill black -colorize 100 LOGO-alpha.webp
```
- repaint solid logo
```
magick white-logo.png -fill black -colorize 100 black-logo.png
```
