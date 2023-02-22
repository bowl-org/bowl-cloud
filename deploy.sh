#!/bin/sh

deploy(){
	rm -f out.tar
	tar -zcf out.tar --exclude-from=".tarignore" .
	ssh -tt $host@$sv 'cd ~/www/; docker-compose down; sudo mv ~/api/db/data ~/temp_data; sudo rm -rf ~/api; mkdir -p ~/api/ ~/api/db; sudo mv ~/temp_data ~/api/db/data'
	scp ./out.tar $host@$sv:~/api/out.tar
	rm -f out.tar
	ssh -tt $host@$sv 'cd ~/api/; tar -xf out.tar; rm -f out.tar; cat .env.prod > .env; cd ~/www/; docker system prune -f; docker rmi mongo www_backend; docker-compose up -d '
}

[ ! -z "$host" ] && [ ! -z "$sv" ] && deploy || echo 'Host name or host address invalid!' >&2

