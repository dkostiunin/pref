let count_glob=0,count_game=0
socket.on('chat', function(msg){
	if(msg[2].chat_mess_glob==='flex'){let c=document.getElementById('chat_mess_glob')
		input_name.value===msg[0]?c.insertAdjacentHTML('beforeend',`<p class="mess"><b>Я: </b><i>${msg[1]}</i></p>`):c.insertAdjacentHTML('beforeend',`<p class="mess"><b>${msg[0]}: </b>${msg[1]}</p>`)
		if(c.style.display===''||c.style.display==='none'){count_glob++;let n=chat_glob.textContent.split(' ');chat_glob.textContent=n[0]+' '+n[1]+' '+count_glob}
	}
	else if(msg[2].chat_mess_game==='flex'){let c=document.getElementById('chat_mess_game')
		input_name.value===msg[0]?c.insertAdjacentHTML('beforeend',`<p class="mess"><b>Я: </b><i>${msg[1]}</i></p>`):c.insertAdjacentHTML('beforeend',`<p class="mess"><b>${msg[0]}: </b>${msg[1]}</p>`)
		if(c.style.display===''||c.style.display==='none'){count_game++;let n=chat_game.textContent.split(' ');chat_game.textContent=n[0]+' '+n[1]+' '+count_game}
	}
})

function clear_m(){socket.emit('chat','mongo')
	if(chat_mess_glob.style.display==='flex'){while(chat_mess_glob.firstChild){chat_mess_glob.removeChild(chat_mess_glob.firstChild)}}
	else if(chat_mess_game.style.display==='flex'){while(chat_mess_game.firstChild){chat_mess_game.removeChild(chat_mess_game.firstChild)}}
	}

function chat_en_dis(el){
	if(el.id==='chat_glob'&&el.textContent!=='Свернуть'){count_glob=0
		chat_mess_game.style.display='none';chat.style.display='initial';chat_mess_glob.style.display='flex';el.textContent='Свернуть';chat_game.textContent='Игровой чат'
	}
	else if(el.id==='chat_game'&&el.textContent!=='Свернуть'){count_game=0
		chat_mess_glob.style.display='none';chat.style.display='initial';chat_mess_game.style.display='flex';el.textContent='Свернуть';chat_glob.textContent='Общий чат'
	}
	else if(el.textContent==='Свернуть'){
		chat.style.display='none';chat_mess_game.style.display='none';chat_mess_glob.style.display='none';chat_game.textContent='Игровой чат';chat_glob.textContent='Общий чат'
	}
}

document.getElementById('form_mess').addEventListener('submit', function(e){					
	e.preventDefault();	
	socket.emit('chat',[input_name.value,inp_mess.value,{'chat_mess_glob':chat_mess_glob.style.display,'chat_mess_game':chat_mess_game.style.display}]);
})

const ch_b=document.getElementById('chat_but'),ch_all=document.getElementById('chat_all'),
controls_b=document.getElementById('controls'),c_b=document.getElementById('contr_b')
function handler_m(e){change(ch_all,e.pageX,e.pageY)}
function handler_t(e){change(ch_all,e.changedTouches[0].pageX,e.changedTouches[0].pageY)}
function change(el,x,y){el.style.left=(x-165)+'px';el.style.top=(y-30)+'px'}
ch_b.addEventListener('mousedown',e=>{document.addEventListener('mousemove',handler_m)})
ch_b.addEventListener('mouseup',e=>{document.removeEventListener('mousemove',handler_m)})
ch_b.addEventListener('touchstart',e=>{document.addEventListener('touchmove',handler_t)})
ch_b.addEventListener('touchend',e=>{document.removeEventListener('touchmove',handler_t)})

function handler_m1(e){change1(controls_b,e.pageX,e.pageY)}
function handler_t1(e){change1(controls_b,e.changedTouches[0].pageX,e.changedTouches[0].pageY)}
function change1(el,x,y){el.style.left=(x-50)+'px';el.style.top=(y-50)+'px'}
contr_b.addEventListener('mousedown',e=>{document.addEventListener('mousemove',handler_m1)})
contr_b.addEventListener('mouseup',e=>{document.removeEventListener('mousemove',handler_m1)})
contr_b.addEventListener('touchstart',e=>{document.addEventListener('touchmove',handler_t1)})
contr_b.addEventListener('touchend',e=>{document.removeEventListener('touchmove',handler_t1)})