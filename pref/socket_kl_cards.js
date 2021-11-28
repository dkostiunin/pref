let svgns = "http://www.w3.org/2000/svg",svg99 = "http://www.w3.org/1999/xlink",koloda=[],socket=io(),timer1

document.addEventListener('DOMContentLoaded', function(e){//	при загрузке страницы из куков достает имя пользователя и вставляет его в поле имени
	change_size_window()
	let ind1 = document.cookie.match(/user=/), butt = document.getElementById('but_name');
	if (document.cookie&&ind1!==null){//если куки есть и в куках имя уже есть выделяем имя игрока из куков и вставляем его в поле с именем игрока
		let n_c=data_from_cookie('user='), name=document.getElementById('input_name')		
		simbols.forEach(el=>{
			if(n_c.includes(el)===true){n_c=n_c.replace(/[^a-zа-яё0-9]/gi,'');document.cookie = 'user='+n_c+'; max-age='+31536000;}
		})
		butt.textContent='Сменить свое имя'
		but_name.insertAdjacentHTML('afterend','<button id="look_pass" onclick="look_pas()">Посмотреть пароль</button>')
		name.value=n_c;socket.emit('open_page', name.value)
	}
	else{butt.insertAdjacentHTML('afterend',policy_user)}
})

socket.on('open_page', function(games,players,user,paswrd,buy_card,n){
	remove_els()
	let p1=document.getElementById('input_name'),p2=document.getElementById('sec_player'),p3=document.getElementById('third_player'),
	butt=document.getElementById('join_game')
	if(!butt){but_name.insertAdjacentHTML('afterend','<<button id = "join_game" onclick="j_game(this)">Создать игру</button>')}
	join_game.textContent='Закончить игру';p1.disabled = true;
	main_div.insertAdjacentHTML('beforeend','<p id="hand_waiting" style="left:115px">Ждем: 1-я рука</p>')
	set_hands(players,p1,p2,p3);let first=hand_player.textContent,second=p2.textContent.slice(-8),third=p3.textContent.slice(0,8)
	hand_waiting.insertAdjacentHTML('afterend','<p style="left:270px" id="ev_wait"></p>')
	koloda=[];let temp_m=[];temp_m.push(hand_player.textContent);temp_m.push(paswrd[hand_player.textContent][3])
	games.map(i=>{temp_m.push(i[3])});koloda.push(temp_m);
	let w=document.documentElement.clientWidth-20,h=document.documentElement.clientHeight,diff=w/(h-20)-0.477
	for (let key in paswrd){
		if (paswrd[key][1]==undefined&&(key===second||key===first||key===third)){paswrd[key]=[' ',' ']}
		if (key===first){
			main_div.insertAdjacentHTML('beforeend',`<p style="position:absolute;left:10px;bottom:60px" id="trump1_id">${paswrd[key][1]}</p>`)
			if (paswrd[key][1].slice(-1)==='♦'||paswrd[key][1].slice(-1)==='♥'){trump1_id.style.color = 'red'}
		}
		else if (key===second){
			p2.insertAdjacentHTML('afterend', `<p style="margin-left:10px" id="trump2_id">${paswrd[key][1]}</p>`)
			if (paswrd[key][1].slice(-1)==='♦'||paswrd[key][1].slice(-1)==='♥'){trump2_id.style.color = 'red'}
		}
		else if (key===third){
			p3.insertAdjacentHTML('beforebegin',`<p style="margin-right:10px" id="trump3_id">${paswrd[key][1]}</p>`)
			if (paswrd[key][1].slice(-1)==='♦'||paswrd[key][1].slice(-1)==='♥'){trump3_id.style.color = 'red'}
		}
		else if (paswrd[key][0]&&key==='n_hand'){hand_waiting.textContent=paswrd[key][0]}
	}
	if (paswrd.stat==='trade'){ev_wait.textContent='Заказывает'
		main_div.insertAdjacentHTML('beforeend',user);deal_cards(games,100,h-166);
		let x;w+20>=h?x=w-((games.length+3)*w*.033):(x=w-120,diff=1)
		deal_for_opponents(p2.id, 20, games.length,diff);
		deal_for_opponents(p3.id,x,games.length,diff);
		deal_for_opponents('buy_in',20+(w*0.033*(games.length+2)),2,diff);
		inact_trade_but(paswrd.n_hand[1],paswrd.n_hand[2]);if(paswrd[hand_player.textContent][0]!==' '){inact_but('miser')}
	}
	else if (paswrd.stat==='drop'){
		ev_wait.textContent='сбрасывает карты';deal_cards(games, 100, h-166)
		let x,count;
		trump3_id.textContent==='Пас'?count=13:count=15
		w+20>=h?x=w-(count*w*.033):(x=w-120,diff=1)
		trump2_id.textContent==='Пас'?deal_for_opponents(p2.id, 20, 10,diff):deal_for_opponents(p2.id, 20, 12,diff)
		deal_for_opponents(p3.id,x,count-3,diff)		
		if (trump1_id.textContent!=='Пас'){main_div.insertAdjacentHTML('beforeend',user);
			hand_player.textContent==='1-я рука'?inact_trade_but(paswrd.n_hand[1], paswrd.n_hand[2]):inact_trade_but(paswrd.n_hand[1], paswrd.n_hand[2]-1),inact_but('miser'), inact_but('pas');trade_desk.style.display='none';
		}
	}
	else if (paswrd.stat==='order'){refresh_page(games,10,10)
		if (trump1_id.textContent!=='Пас'){main_div.insertAdjacentHTML('beforeend',user);
			hand_player.textContent==='1-я рука'?inact_trade_but(paswrd.n_hand[1], paswrd.n_hand[2]):inact_trade_but(paswrd.n_hand[1], paswrd.n_hand[2]-1),inact_but('miser'), inact_but('pas')
		}
	}
	else if (paswrd.stat==='wist'){refresh_page(games,10,10)
		if (hand_player.textContent===paswrd['n_hand'][0].substring(6)){
			main_div.insertAdjacentHTML('beforeend',user); let t1=document.getElementById('trump2_id'),t2=document.getElementById('trump3_id')
			if ((t1&&t1.textContent==='Пас')||(t2&&t2.textContent==='Пас')){wist_half.disabled=false;let el=document.getElementById('pas');el.disabled="disabled";el.style.opacity = 0.6}
		}
	}
	else if (paswrd.stat==='l_d'){refresh_page(games,10,10)
		if (hand_player.textContent===paswrd['n_hand'][0].substring(6)){main_div.insertAdjacentHTML('beforeend',user)}
	}
	else if (paswrd.stat==='playing'){
		refresh_page(games,paswrd[second][2],paswrd[third][2]);ev_wait.textContent='ходит';set_trick(paswrd);
		user.forEach(el=>deal_use_card(el[1],el[0])); let suit=games.map(el=>el[0])
		if ((!buy_card||(buy_card&&paswrd.n_hand[1]!=='распасовка'))&&user.length!==0&&hand_waiting.textContent.slice(6)===first){
			disable_deck(games,user[0][1][0],suit,paswrd.n_hand[1])
		}
		else if(buy_card&&paswrd.n_hand[1]==='распасовка'){
			if(n===0){if(w+20<h){diff=1}
				deal_for_opponents('buy_in',20+(w*0.033*12),1,diff);buy_in0.id='buy_in1'
			}
			deal_cards([buy_card],427,30)
			if(hand_waiting.textContent.slice(6)===first){disable_deck(games,buy_card[0],suit,paswrd.n_hand[1])}
		}
		if(n==='В светлую'){let hand_wist
			for (let h in buy_card){
				if(h===hand_player.textContent){koloda=[];
					for (let key in buy_card){let m=[];m.push(key,paswrd[key][3])
					buy_card[key][3].map(i=>{m.push(i[3])});koloda.push(m)}
					}
				if(h===sec_player.textContent.slice(-8)){remove_cards(10, 'sec_player');deal_sec_pl(buy_card[h][3])}
				else if(h===third_player.textContent.slice(0,8)){remove_cards(10, 'third_player');deal_c_third_pl(buy_card[h][3])}
				if(buy_card[h][1]==='Вист'){hand_wist=h}
			}			
			if(paswrd[paswrd.n_hand[0].slice(6)][1]==='Пас'&&paswrd.n_hand[3]!=10&&paswrd.n_hand[3]!=='Мизер'){hand_waiting.textContent='Ждем: '+hand_wist}
			if(paswrd[paswrd.n_hand[0].slice(6)][1]==='Вист'&&hand_player.textContent===hand_waiting.textContent.slice(6)){disable_pas('Вист',buy_card)}
			else if(hand_player.textContent===hand_waiting.textContent.slice(6)&&paswrd[paswrd.n_hand[0].slice(6)][1]==='Пас'&&paswrd.n_hand[3]!=10&&paswrd.n_hand[3]!=='Мизер'){
				disable_pas('Пас',buy_card); let s=buy_card[paswrd.n_hand[0].slice(6)][3].map(el=>el[0])
				if(user.length!==0){disable_deck(buy_card[paswrd.n_hand[0].slice(6)][3],user[0][1][0],s,paswrd.n_hand[1])}
			}
			else if(hand_player.textContent===hand_waiting.textContent.slice(6)&&paswrd[paswrd.n_hand[0].slice(6)][1]==='Пас'&&(paswrd.n_hand[3]==10||paswrd.n_hand[3]==='Мизер')){for(let h in buy_card){if(h===hand_player.textContent){delete buy_card[h]}};disable_pas(10,buy_card)}
			else if(hand_player.textContent===hand_waiting.textContent.slice(6)&&(trump1_id!=='Пас'||trump1_id.textContent!=='Вист')){
				disable_pas(trump1_id.textContent,buy_card);
			}
		}
	}
	else if (paswrd.stat==='fin'){set_trick(paswrd);let hand=document.getElementById('hand_waiting');if(hand){hand.remove()}}
})

socket.on('join', function(data){
	let butt=document.getElementById('join_game'),j_w=document.getElementById('join_window'),p1=document.getElementById('input_name'),p2=document.getElementById('sec_player'),p3=document.getElementById('third_player')
	if (data[1]==='Создать игру'){
		if(data[0]==='Cбой'){butt.disabled=false;p1.disabled=false}
		else if(j_w){let last=j_w.lastElementChild;j_w.style.display='initial'
			last?last.insertAdjacentHTML('afterend',data[0]):j_w.insertAdjacentHTML('beforeend',data[0])
		}		
		if(data[2]===data_from_cookie('user=')){butt.textContent='Отменить создание';butt.disabled=false;p1.value=data_from_cookie('user=');p1.disabled=true}
	}
	else if (data[1]==='Присоединиться'){let str=document.getElementById(data[0]);
			if(str){str.innerHTML=data[2];
			if(data[3]===data_from_cookie('user=')){
				str.style.opacity=1;butt.textContent='Выйти';butt.disabled=false;p1.value=data_from_cookie('user=');p1.disabled=true
			}
		}
	}
	else if (data[1]==='Отменить создание'){
		let str=document.getElementById('pl_'+data[0]);if(str){str.remove()}
		if(p1.value===data[0]||p1.value===data[2]){butt.disabled=false;butt.textContent='Создать игру';p1.disabled=false}
		else if(data[2]&&data[2].includes(p1.value)===true){p1.disabled=true;butt.disabled=true}
	}
	else if (data[1]==='Выйти'){let str=document.getElementById('pl_'+data[0])
		if(str){str.innerHTML=str.innerHTML.slice(0,-(data[2].length+35))}
		if(data[2]===data_from_cookie('user=')&&butt.textContent==='Выйти'){butt.disabled=false;butt.textContent='Создать игру';p1.disabled=false}
		
	}
	else if (data[1]==='in_game'){
		let g=document.getElementById(data[0]);if(g){g.style.opacity=1};main_div.insertAdjacentHTML('beforeend',data[2]);p1.disabled=true
	}
	else if (data[1]==='Старт'){let m=[]
		let w=document.documentElement.clientWidth-20,h=document.documentElement.clientHeight,diff=w/(h-20)-0.477
		remove_els();butt.textContent='Закончить игру';butt.disabled=false;p1.disabled=true;set_hands(data[2],p1,p2,p3);
		koloda=[];m.push(hand_player.textContent,p1.value),data[3].map(i=>{m.push(i[3])});koloda.push(m);
		deal_cards(data[3],100,h-166);
		let x;w+20>=h?x=w-(13*w*.033):(x=w-120,diff=1)
		deal_for_opponents(p2.id,20,10,diff);deal_for_opponents(p3.id,x,10,diff);deal_for_opponents('buy_in',20+(w*0.033*12),2,diff);
		main_div.insertAdjacentHTML('beforeend',data[0])
		main_div.insertAdjacentHTML('beforeend','<p id="hand_waiting" style="left:115px">Ждем: 1-я рука</p>')
		hand_waiting.insertAdjacentHTML('afterend', '<p style="left:270px" id="ev_wait">Заказывает</p>')
	}
	else if (data[1]==='Закончить игру'){
		remove_els();butt.disabled=false;p1.disabled=false;
		if(timer1){clearInterval(timer1)};let t=document.getElementById("timer");if(t){t.remove()};
		p2.textContent='Второй игрок пока отсутствует';p3.textContent='Третий игрок пока отсутствует';add_join_window(data[0],butt,p1);
	}
	else if (data[1]==='bot'){
		koloda.forEach(i=>{if(i.includes(data[0])===true){i[1]=data[2]}})
		if(p2.textContent.includes(data[0])===true){
			p2.textContent=p2.textContent.replace(data[0],data[2])
		}
		else if(p3.textContent.includes(data[0])===true){p3.textContent=p3.textContent.replace(data[0],data[2])}
		else if(data[0]==='reload'){window.location.reload(true)}
		
	}
	else if (data[0]==='отключился от игры'){
		if (p2.textContent.slice(0,-9)===data[1]){p2.insertAdjacentHTML('afterend', '<p id = "discon_2" >Отключился от игры</button>')}
		if (p3.textContent.slice(9)===data[1]){p3.insertAdjacentHTML('afterend', '<p id = "discon_3" >Отключился от игры</button>')}
	}
	else if (data[0]==='подключился'&&data[1]===socket.id&&p1.value!=''){
		socket.emit('join',[p1.value,data[0],butt.textContent]);socket.emit('open_page',p1.value)
		}
	else if (data[1]==='подключился'){
		if (p2.textContent.slice(0,-9)===data[0]){while(document.getElementById('discon_2')){document.getElementById('discon_2').remove()}}
		if (p3.textContent.slice(9)===data[0]){while(document.getElementById('discon_3')){document.getElementById('discon_3').remove()}}
	}
	else if (data[1]==='кто онлайн'){let el
		for (let i in data[2]){if(i!==data_from_cookie('user=')){
				if(data[2][i][1]==0){el=`<p class="join_el">Свободен    <b onclick="statistic(this)">${i}</b></p>`}
				else if(data[2][i][1]==1){el=`<p class="join_el">В игре      <b onclick="statistic(this)">${i}</b></p>`}
				search_name.insertAdjacentHTML('afterend',el)
		}}
	}
	else if (data[1]==='онлайн'){let d=document.getElementById('qty_vis');if(d){d.textContent=data[0]}}
	else if (data[1]==='Статистика'){main_div.insertAdjacentHTML('beforeend',stat_user);let s=stat_u.querySelectorAll('span')
		for (let e of s){let m=e.id.split('_');	if(m.length==1){e.textContent=data[0][m[0]]}else if(m.length==2){e.textContent=data[0][m[0]][m[1]]}}
	}
	else if (data[1]==='help'){insrt_help(data[0])}
})

socket.on('trade', function(data){
	hand_waiting.textContent=data[3]['n_hand'][0];	var trump
	let trump1 = document.getElementById('trump1_id'), trump2 = document.getElementById('trump2_id'), trump3 = document.getElementById('trump3_id')
	inact_trade_but(data[0], data[1])
	if (hand_player.textContent===data[2]){trump1===null?main_div.insertAdjacentHTML('beforeend', `<p style="position:absolute;left:10px;bottom:60px" id="trump1_id">${data[4]}</p>`):trump1.textContent=data[4];trump = document.getElementById('trump1_id')
	}
	else if (sec_player.textContent.slice(-8)===data[2]){trump2===null?sec_player.insertAdjacentHTML('afterend',`<p style="margin-left:10px" id="trump2_id">${data[4]}</p>`):trump2.textContent=data[4];trump=document.getElementById('trump2_id')
	}
	else if (third_player.textContent.slice(0,8)===data[2]){trump3===null?third_player.insertAdjacentHTML('beforebegin',`<p style="margin-right:10px" id="trump3_id">${data[4]}</p>`):trump3.textContent=data[4];trump=document.getElementById('trump3_id')
	}
	(data[4].slice(-1)==='♦'||data[4].slice(-1)==='♥')?trump.style.color = 'red':trump.style.color = 'black'
})

socket.on('assign_game', function(data){
	let w=document.documentElement.clientWidth-20,h=document.documentElement.clientHeight,diff=w/(h-20)-0.477
	if (data[0]==='назначить игру'){
		buy_in0.remove(); buy_in1.remove(); deal_cards(data[1], 500, 20)
		let el = document.getElementById('trade_desk'); el.style.display='none'; main_div.insertAdjacentHTML('beforeend', data[2]);
		let t=document.getElementById("timer"),time_sec = 5
		timer1 = setInterval(()=>{time_sec<0?(clearInterval(timer1),t.remove()):t.textContent=time_sec;--time_sec}, 1000)
	}
	else if (data[0]==='stop'){remove_cards(2,data[2])
		if(ev_wait.textContent==='Заказывает'){
			let x;w+20>=h?x=w-(15*w*.033):(x=w-120,diff=1)
			if (data[1]===sec_player.textContent.slice(0, sec_player.textContent.length - 9)){
				remove_cards(10, 'sec_player'); deal_for_opponents(sec_player.id, 20, 12,diff)
			}
			else if (data[1]===third_player.textContent.slice(9)){remove_cards(10,'third_player');deal_for_opponents(third_player.id,x,12,diff)}
			ev_wait.textContent='сбрасывает карты'
		}		
	}	
	else if (data[0]==='take_ransom'){remove_cards(data[1].length, data[1]); deal_cards(data[1], 100, h-166)}	
	else if (data[0]==='order'){
		koloda[0]=koloda[0].slice(0,2);data[2].map(i=>{koloda[0].push(i[3])})
		remove_cards(data[1].length, data[1]); deal_cards(data[2], 100, h-166)
		let el = document.getElementById('trade_desk'); el.style.display='initial'; let but=el.querySelectorAll('button');
		but.forEach(i=>{if(trump1_id.textContent!=='Пас'&&i.textContent===trump1_id.textContent){i.disabled=false; i.style.opacity=1}
		if(i.id==='pas'){i.disabled='disabled'; i.style.opacity=0.4}})
	}
	else if (data[0]==='сбросил'){
		ev_wait.textContent='Заказывает игру';
		let x;w+20>=h?x=w-(13*w*.033):(x=w-120,diff=1)
		if (trump2_id.textContent!=='Пас'){remove_cards(12, 'sec_player');deal_for_opponents(sec_player.id, 20, 10,diff)}
		else if (trump3_id.textContent!=='Пас'){remove_cards(12, 'third_player');deal_for_opponents(third_player.id,x, 10,diff)}
	}
})

socket.on('order', function(data){
	if (data[0]==='вист'){
		hand_waiting.textContent=data[2]['n_hand'][0];set_h_trump(data);;if(document.getElementById('trade_desk')){trade_desk.remove()}
		if(hand_player.textContent!==data[1][2]&&document.getElementById('wist_desk')){wist_desk.remove()}
	}
	else if (data[0]==='wist_full') {main_div.insertAdjacentHTML('beforeend',data[1])}
	else if (data[0]==='pas'){main_div.insertAdjacentHTML('beforeend',data[1]);
		if(data[2][data[2].n_hand[2]][1][0]==6||data[2][data[2].n_hand[2]][1][0]==7){
			wist_half.disabled=false;let el=document.getElementById('pas');el.disabled="disabled";el.style.opacity=0.6
		}
	}
	else if (data[0]==='l_d'){main_div.insertAdjacentHTML('beforeend',data[1])}
})

socket.on('playing', function(data){
	if (data[0]==='игра'){let ld=document.getElementById('light_dark');if(ld){ld.remove()}
		hand_waiting.textContent='Ждем: 1-я рука'; set_h_trump(data);ev_wait.textContent='ходит';set_trick(data[2])
		if(data[4]){let hand_wist
			for (let h in data[4]){
				if(h===sec_player.textContent.slice(-8)){remove_cards(10, 'sec_player');deal_sec_pl(data[4][h][3])}
				else if(h===third_player.textContent.slice(0,8)){remove_cards(10, 'third_player');deal_c_third_pl(data[4][h][3])}
				if(data[4][h][1]==='Вист'){hand_wist=h
					if(data[1][0]==='В светлую'&&h===hand_player.textContent){koloda=[]
						for (let key in data[4]){
							let m=[];m.push(data[4][key][0],data[4][key][2]);
							for (let i=0;i<data[4][key][3].length;i++){m.push(data[4][key][3][i][3])}
							koloda.push(m)
						}
					}
				}
			}
			if(data[3]!=10){
				if(data[2]['1-я рука'][1]==='Пас'){
					hand_waiting.textContent='Ждем: '+hand_wist;if(hand_player.textContent===hand_waiting.textContent.slice(6)){disable_pas('Пас',data[4])}
				}
				else if(hand_player.textContent===hand_waiting.textContent.slice(6)&&hand_player.textContent!=='Пас'){
					disable_pas(trump1_id.textContent,data[4])
				}
			}
			else{for(let h in data[4]){if(h===hand_player.textContent){delete data[4][h]}};
				if(hand_player.textContent===hand_waiting.textContent.slice(6)){disable_pas(10,data[4])}
				if(trump1_id.textContent!=='Пас')(trade_desk.remove())
			}
		}
	}
	if (data[0]==='распасовка'){trade_desk.remove(); buy_in0.remove();ev_wait.textContent='ходит'
		hand_waiting.textContent='Ждем: 1-я рука';set_trick(data[2]);deal_cards([data[1]], 427, 30)
	}
	else if (data[0]==='run'){
		deal_use_card(data[3],data[1][1],data[4])
		if(data[2][data[2]['n_hand'][0].slice(6)][1]==='Пас'&&data[2][hand_player.textContent][0]==='В светлую'){let count=0
			for (let h in data[2]){if (h==='n_hand'||h==='stat'){continue}
				if(data[2][h][1]==='Вист'){hand_waiting.textContent='Ждем: '+h;break};if(data[2][h][1]==='Пас'){count++}
			}
			if(count==2){hand_waiting.textContent=data[2]['n_hand'][0]}
		}
		else{hand_waiting.textContent=data[2]['n_hand'][0]}
		if (data[5].length===3){set_trick(data[2])		
			setTimeout(()=>{let card;data[5].forEach(i=>{card=document.getElementById(i[1][3]);if(card){card.remove()}})},2000)
		}
	}
	else if(data[0]==='retake'){
		remove_cards(data[1].length, data[1]); if(data[1].length!==0){
			let w=document.documentElement.clientWidth-20,h=document.documentElement.clientHeight,diff=w/(h-20)-0.477
			deal_cards(data[1], 100,h-166)
		}
		if(data[3]===9){buy_in1.remove();document.getElementById(data[2][0][3]).remove();deal_cards([data[2][1]], 427, 30)}
		else if(data[3]===8){document.getElementById(data[2][1][3]).remove()}
		else if(data[2]==='В светлую'){
			for (let h in data[3]){
				if(h===sec_player.textContent.slice(-8)){remove_cards(data[3][h][3].length,data[3][h][3]);deal_sec_pl(data[3][h][3])}
				else if(h===third_player.textContent.slice(0,8)){remove_cards(data[3][h][3].length, data[3][h][3]);deal_c_third_pl(data[3][h][3])}
			}
			if(hand_player.textContent===hand_waiting.textContent.slice(6)&&data[5]!=10&&data[5]!=='Мизер'){disable_pas(data[4],data[3])}
			else if(hand_player.textContent===hand_waiting.textContent.slice(6)&&(data[5]==10||data[5]==='Мизер')){
				for(let h in data[3]){if(h===hand_player.textContent){delete data[3][h]}};disable_pas(10,data[3])
			}
		}
	}
	else if(data[0]==='disable'){let elem=document.querySelectorAll('use');for(let e of elem){if(e.style.opacity==0.6){e.style.opacity=1}}
		disable_deck(data[1],data[2],data[3],data[4])
		if(data[7]==10||data[7]==='Мизер'){for(let h in data[5]){if(h===hand_player.textContent){delete data[5][h]}};disable_pas(10,data[5])}
		else{disable_pas(data[6],data[5])}
	}
	else if(data[0]==='pulya'){
		const pull={'l':[['gora_l',33],['pulya_l',38],['vist_ll',16],['vist_lr',28]],'b':[['gora_b',26],['pulya_b',35],['vist_bl',22],['vist_br',23]],
		'r':[['gora_r',33],['pulya_r',37],['vist_rl',27],['vist_rr',16]]}
		let t,id,rez=[],calc=0,tot=[],el=document.getElementById('pulya'); el.style.display==='none'?el.style.display='initial':el.style.display='none'
		for (let k in pull){let p1,p2,p3;
			if (k==='l'){p1=input_name.value;p2=sec_player.textContent.slice(0,-9);p3=third_player.textContent.slice(9)}
			else if (k==='b'){p2=input_name.value;p3=sec_player.textContent.slice(0,-9);p1=third_player.textContent.slice(9)}
			else if (k==='r'){p3=input_name.value;p1=sec_player.textContent.slice(0,-9);p2=third_player.textContent.slice(9)}
			cut_text(pull[k][0],data[1][p2].gora);cut_text(pull[k][1],data[1][p2].pul);
			cut_text(pull[k][2],data[1][p2][p3]);cut_text(pull[k][3],data[1][p2][p1]);
			let gora_fin=(data[1][p2].gora.split('.').slice(-2,-1)-data[1][p2].pul.split('.').slice(-2,-1))/3*10
			let vl=Number(data[1][p1][p2].split('.').slice(-2,-1))+gora_fin, vr=Number(data[1][p3][p2].split('.').slice(-2,-1))+gora_fin
			rez.push([p1,p2,vl], [p3,p2,vr])
		}
		rez.forEach(i=>{rez.find(j=>j[0]===i[0]);i.push(i[2]-rez.find(j=>j[1]===i[0]&&j[0]===i[1])[2])})
		for (let k in data[1]){if (k!=='finish'){let r=Math.round(rez.filter(i=>i[0]===k).reduce((s,i)=>s+i[3],0));calc=calc+r;tot.push([k,r])}}
		if(calc!==0){
			if (tot[0][1]===tot[1][1]){tot[2][1]=tot[2][1]-calc}else if(tot[0][1]===tot[2][1]){tot[1][1]=tot[1][1]-calc}
			else if(tot[1][1]===tot[2][1]){tot[0][1]=tot[0][1]-calc}else{t=tot.findIndex(i=>i[1]===Math.max(...tot.map(i=>i[1])));tot[t][1]=tot[t][1]-calc}
		}
		tot.forEach(k=>{if(k[0]===input_name.value){id=document.getElementById('res_b')}else if(k[0]===sec_player.textContent.slice(0,-9)){id=document.getElementById('res_l')}else{id=document.getElementById('res_r')};id.textContent=k[1];if (String(k[1]).length>4){id.style['font-size']='12px'}})
		pulya_lenqth.textContent=data[1].finish
	}
})

screen.orientation.onchange = function(e) {window.location.reload(true)}

window.addEventListener('load',async()=>{if(navigator.serviceWorker){const reg=await navigator.serviceWorker.register('/pref/sw.js')}})