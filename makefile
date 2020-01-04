all:
	prettier *.user.js --write 
	eslint *.user.js --fix
