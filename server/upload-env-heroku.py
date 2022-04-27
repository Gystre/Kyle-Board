import os
from dotenv import load_dotenv
import copy

# would be way easier with open() but it doesn't like the .env file name lol
before = copy.deepcopy(os.environ)
load_dotenv()
after = os.environ

for key, value in after.items():
    if key not in before:
        a = key + "=" + value
        print("Setting config " + a)
        os.system("heroku config:set " + key + "=" + value + " -a kyle-board")
