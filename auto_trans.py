import subprocess
import time


while True:
	subprocess.call("python3 translate.py", shell=True, stdout=subprocess.DEVNULL)
	time.sleep(3)

