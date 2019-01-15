#!/usr/bin/env python
from os import walk, path
import json
from subprocess import check_call

# "@" breaks sh $args; replace with something non-offensive
replace_amp = "012345678901234567890123456789"

metas = []
for root, dirs, files in walk(".", topdown=False):
    for name in files:
        _ = path.join(root, name)
        if "metadata.json" in _:
            metas.append(_)
    # for name in dirs:
    #     _ = path.join(root, name)
    #     if "metadata.json" in _:
    #         metas.append(_)

assert len(metas) == 1

src = str(path.abspath('.'))
metadata = json.load(open(metas[0],"r"))

gss = metadata.get("settings-schema")
name = metadata.get("name").decode()
desc = metadata.get("description").decode()
gsv = metadata.get("shell-version")[0].decode()
uuid = metadata.get("uuid").decode()

cmd1 = "sh _prepare.sh {}".format(uuid).split()
cmd2 = "sh _install.sh {src} {uuid}".format(
    src=src,
    uuid=uuid.replace("@", replace_amp)).split()

print("GENERATING...")
check_call(cmd1)
print("INSTALLING")
check_call(cmd2)
print("DONE")
