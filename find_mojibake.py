import re

with open('index.html', 'rb') as f:
    content = f.read()

# Find all potential mojibake (sequences of UTF-8 encoding of Windows-1252 mapped bytes)
# Typically they start with \xc2 or \xc3.
for match in re.finditer(b'[\xc2\xc3][\x80-\xbf]{1,5}', content):
    seq = match.group(0)
    try:
        decoded = seq.decode('utf-8').encode('windows-1252').decode('utf-8')
        print(f"{seq} -> {decoded}")
    except:
        pass
