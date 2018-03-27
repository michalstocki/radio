# go to directory containing this file
cd "$( dirname "${BASH_SOURCE[0]}" )"

# wait for internet connection
for i in {1..50}; do ping -c1 www.github.com &> /dev/null && break; done

# pull changes
git pull || true

# update dependencies
npm install || true

# play radio
npm start
