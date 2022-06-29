SOURCE_IMAGES=$(wildcard images/*.png)

all: index.html

index.html : index-head.html index-foot.html $(SOURCE_IMAGES:.png=.jpg)
	node index | cat index-head.html - index-foot.html > index.html

%.jpg : %.png
	convert $< $<.ppm
	cjpeg -optimize -quality 85 $<.ppm > $@
	rm $<.ppm

clean:
	rm -f index.html images/*.jpg images/*.ppm
