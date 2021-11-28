function b_game(){ //нажатие кнопки запомнить или поменять имя
	if (input_name.value.length!==0&&input_name.value[0]!==' '){
		input_name.value=input_name.value.replace(/[^a-zа-яё0-9]/gi, '')
		if (but_name.textContent==='Запомнить мое имя'){socket.emit('check_in', input_name.value, but_name.textContent)}
		else if (but_name.textContent==='Сменить свое имя'&&data_from_cookie('user=')!==input_name.value){
			let old_name=data_from_cookie('user='), passw=data_from_cookie('pswd=')	
			socket.emit('check_in', [input_name.value, old_name, passw], but_name.textContent)			
		} 		
	}
}
const simbols=[' ','/','\\','.','[',']','^','$','(',')','?',':','*','+','=','!','<','>','|','{','}',',',';','-','"',"`","'"]
function checking(el){if(simbols.includes(el.value.slice(-1))===true){el.value=el.value.slice(0,-1)}}

function but_pass(){	
	if (but_pas.textContent==="Запомнить новый пароль"){
		if (data_from_cookie('pswd=')!==new_pass.value&&new_pass.value.length!==0&&new_pass.value[0]!==' '){
			socket.emit('check_in',[input_name.value,new_pass.value],but_pas.textContent)
		}
	}
	else if (but_pas.textContent==="Ввести пароль"){socket.emit('check_in',[input_name.value,new_pass.value],but_pas.textContent)}	
}

function look_pas(){let passw=data_from_cookie('pswd=');socket.emit('check_in', passw, 'Посмотреть пароль')}

socket.on('check_in', function(games,players,user){
	console.log(games, players, user)
	let p1=document.getElementById('input_name'),butt=document.getElementById('join_game'), but_name=document.getElementById('but_name')
	if ((games==='Запомнить мое имя'||games==='Ввести пароль')&&players!=='enter_pass'){
		let p=document.getElementById('pass_inf');if(p){p.remove()};
		let d=document.getElementById('policy_us');if(d){d.remove()};
		document.cookie = 'user='+p1.value+'; max-age='+31536000; document.cookie = 'pswd='+user+'; max-age='+31536000;
		but_name.textContent='Сменить свое имя'
		let w=document.getElementById('waiting');if(w){w.remove()};let l_pass=document.getElementById('look_pass')
		if (l_pass===null){but_name.insertAdjacentHTML('afterend', '<button id="look_pass" onclick="look_pas()">Посмотреть пароль</button>')}
		if(players==='в игре'){socket.emit('open_page', input_name.value,'Обновилась страница')}
		else{main_div.insertAdjacentHTML('beforeend',players)//собщение о пароле и предложение сменить
			if (butt===null){look_pass.insertAdjacentHTML('afterend','<button id="join_game" onclick="j_game(this)">Создать игру</button>')}
		}		
	}
	else if (games==='Сменить свое имя'&&players==='change_name'){document.cookie = 'user='+user+'; max-age='+31536000}
	else if ((games==='Сменить свое имя'||games==='Запомнить мое имя')&&players==='enter_pass'){	
		const authorization=`<div id="pass_inf">
		<p id="passwrd">Игрок с именем "${p1.value}" уже существует,</p>	
		<p>если это Вы, введите пароль для подтверждения</p>	
		<input type="text" maxlength="25" id="new_pass" placeholder="Введите пароль"/>
		<button id="but_pas" onclick="but_pass()">Ввести пароль</button>
		<button id="close_window"  onclick="close_window()">Закрыть окно</button></div>`
		main_div.insertAdjacentHTML('beforeend', authorization)
	}
	else if (games==='Посмотреть пароль'){main_div.insertAdjacentHTML('beforeend',players)}////собщение о пароле и предложение сменить
	else if (games==='Пароль не верный'){pass_inf.insertAdjacentHTML('beforeend','<p style="position:absolute;left:10px;top:100px;">Пароль не верный</p>')}
	else if (games==='Запомнить новый пароль'){
		document.cookie = 'pswd='+new_pass.value+'; max-age='+31536000;let ps=document.getElementById('passwrd')
		if(ps){let t=ps.textContent.split('"');ps.textContent=t[0]+' "'+new_pass.value+'" '+t[2]}
		else{
			let p=pass_inf.getElementsByTagName('p');while(p[0]){p[0].remove()}
			pass_inf.insertAdjacentHTML('afterbegin',`<p style="text-align:center">Новый пароль - ${players[1]}</p>`)
			}
	}
})