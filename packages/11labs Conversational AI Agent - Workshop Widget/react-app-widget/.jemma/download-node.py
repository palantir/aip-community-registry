#!/usr/bin/env python3
import os
import sys
import urllib.request

if __name__ == "__main__":
    url = sys.argv[1]
    filename = sys.argv[2]
    token = sys.argv[3]
    save_path = os.path.join(os.getcwd(), filename)

    request = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(request) as response:
        with open(save_path, "wb") as out_file:
            out_file.write(response.read())
