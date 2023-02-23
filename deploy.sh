#!/bin/sh

deploy(){
	# password will be entered automatically if $pass is set
	if [ ! -z "$pass" ]; then
		sudo_cmd="echo \"$pass\" | sudo -S"
	else
		echo 'Sudo password is not given! Password prompt will be open...'
		sudo_cmd='sudo'
	fi
	rm -f out.tar
	tar -zcf out.tar --exclude-from=".tarignore" .
	ssh -tt $host@$sv "cd ~/www/; docker-compose down; $sudo_cmd mv ~/api/db/data ~/temp_data; $sudo_cmd rm -rf ~/api; mkdir -p ~/api/ ~/api/db; $sudo_cmd mv ~/temp_data ~/api/db/data"
	scp ./out.tar $host@$sv:~/api/out.tar
	rm -f out.tar
	ssh -tt $host@$sv 'cd ~/api/; tar -xf out.tar; rm -f out.tar; cat .env.prod > .env; cd ~/www/; docker system prune -f; docker rmi mongo www_backend; docker-compose up -d '
}

[ ! -z "$host" ] && [ ! -z "$sv" ] && deploy || ( echo 'Error occurred!' >&2; exit 1 )

