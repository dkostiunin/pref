function close_window(el){let e=document.getElementById('pass_inf'),n=document.getElementById('input_name')
	if(check_name(n)==0&&el!=='in_game'&&!document.getElementById('hand_player')){n.disabled=false};
	e?e.remove():(document.getElementById(el.id).remove())
}

function check_name(n){
	let b,f=0,j=document.getElementById('join_window');if(j){b=j.getElementsByTagName('b')}	
	if(b){for (let i in b){if(b[i].textContent!==undefined&&b[i].textContent===n.value){f=1;break}}}return f
}

const onlineNow=`<div id="online_now">
<input type="text" maxlength="25" id="search_name" placeholder="Введите имя для поиска"/>
</div>`
function visitors_look(el){
	if(el.textContent.slice(0,14)==='Сейчас онлайн:'){
		main_div.insertAdjacentHTML('beforeend',onlineNow);el.textContent='Закрыть окно'
		online_now.addEventListener('input',select_name);socket.emit('join',[input_name.value,'кто онлайн'])
	}
	else if(el.textContent==='Закрыть окно'){let len=online_now.querySelectorAll('p').length+1
		let e=document.getElementById('online_now');if(e){e.removeEventListener('input',select_name);e.remove()};el.textContent='Сейчас онлайн:';
		el.insertAdjacentHTML('beforeend',`<span id="qty_vis">${len}</span>`)
	}	
}

function help(){
	if(!document.getElementById('help_u')){
		if(data_from_cookie('user=')&&!document.getElementById('seconds')){
			socket.emit('join',[data_from_cookie('user='),'help'])
		}
		else if(data_from_cookie('user=')&&document.getElementById('seconds')){
			socket.emit('join',[data_from_cookie('user='),'help','seconds'])
		}
		else{insrt_help('<p>Перед началом игры придумайте себе имя, впишите его в поле в левом нижнем углу, и нажмите кнопку "Запомнить мое имя"</p>')}
	}
}

function insrt_help(mess){
	main_div.insertAdjacentHTML('beforeend',help_user);
	help_u.insertAdjacentHTML('beforeend',mess)
}

const help_user=`<div id="help_u">
<p><button id = "close_stat"  onclick="close_st('help_u')">Закрыть окно</button></p>
</div>`
	
function statistic(el){
		if(!document.getElementById('stat_u')&&data_from_cookie('user=')&&el.textContent==='Статистика'){socket.emit('join',[data_from_cookie('user='),'Статистика'])}
		else if(!document.getElementById('stat_u')&&el.textContent!=='Статистика'){socket.emit('join',[el.textContent,'Статистика'])}
	}
function close_st(id){let e=document.getElementById(id);if(e){e.remove()}}

const stat_user=`<div id="stat_u">
<p>Всего выиграл:&nbsp;&nbsp;&nbsp;<span id="total"></span></p>
<p><strong class="strng">Пули всего: </strong><span id="pul_all"></span> Выиграл: <span id="pul_win"></span></p>
<p>Сбежал  с  розыгрыша: <span id="pul_escape"></span></p>
<p>Сбежал после прикупа: <span id="buyinesc"></span></p>
<p><strong class="strng">6-я играл: </strong><span id="6g_all"></span> Выиграл: <span id="6g_win"></span></p>
<p><strong class="strng">6-я вистовал: </strong><span id="6w_all"></span> Выиграл: <span id="6w_win"></span></p>
<p><strong class="strng">7-я играл: </strong><span id="7g_all"></span> Выиграл: <span id="7g_win"></span></p>
<p><strong class="strng">7-я вистовал: </strong><span id="7w_all"></span> Выиграл: <span id="7w_win"></span></p>
<p><strong class="strng">8-я играл: </strong><span id="8g_all"></span> Выиграл: <span id="8g_win"></span></p>
<p><strong class="strng">8-я вистовал: </strong><span id="8w_all"></span> Выиграл: <span id="8w_win"></span></p>
<p><strong class="strng">9-я играл: </strong><span id="9g_all"></span> Выиграл: <span id="9g_win"></span></p>
<p><strong class="strng">9-я вистовал: </strong><span id="9w_all"></span> Выиграл: <span id="9w_win"></span></p>
<p><strong class="strng">Пасовал на 6-9: </strong><span id="pas"></span></span></p>
<p><strong class="strng">Распасы: </strong><span id="raspas_all"></span> Выиграл: <span id="raspas_win"></span></p>
<p><strong class="strng">10-я играл: </strong><span id="10g_all"></span> Выиграл: <span id="10g_win"></span></p>
<p><strong class="strng">10-я пасовал: </strong><span id="10p_all"></span> Выиграл: <span id="10p_win"></span></p>
<p><strong class="strng">Мизер играл: </strong><span id="miserg_all"></span> Выиграл: <span id="miserg_win"></span></p>
<p><strong class="strng">Мизер пасовал: </strong><span id="miserp_all"></span> Выиграл: <span id="miserp_win"></span></p>
<p><button id = "close_stat"  onclick="close_st('stat_u')">Закрыть окно</button></p>
</div>`

function select_name(e){let names=online_now.querySelectorAll('p')	
	if (names){
		names.forEach(i=>{
			if(e.target.value!==''&&i.textContent.slice(12).includes(e.target.value)===false){i.style.display='none'}
			else if(e.target.value===''){i.style.display='block'}
		})		
	}
}

function remove_els(){
	let remove_el = ['buy_in0','buy_in1','trade_desk','hand_player','trump1_id','trump2_id','trump3_id','hand_waiting','waiting','ev_wait','join_window','wist_desk','light_dark','trick1','trick2','trick3','dis_cards','online_now'];
	remove_el.forEach(i=>{let r_el=document.getElementById(i);if(r_el){r_el.remove()}});
	let els=document.querySelectorAll('use');for (let elem of els){elem.remove()}
}

function deal_use_card(deck, hand, data) {//создает из свг объекта элемент на странице
	let x,y,card=document.getElementById(deck[3]),h=document.documentElement.clientHeight
	if(hand===hand_player.textContent){x=427;h<500?y=h-250:y=220;if(data){card.remove()}}
	else if(hand===sec_player.textContent.slice(-8)){x=364;y=100;
		if(data){card?card.remove():document.getElementById('sec_player'+(data-1)).remove()}
	}
	else if(hand===third_player.textContent.slice(0,8)){x=490;y=100;
		if(data){card?card.remove():document.getElementById('third_player'+(data-1)).remove()}
	}
	set_attr(deck[3],x,y,deck[2],'')
}

function deal_cards(pref_deck,x,y) {//создает из свг объекта элемент на странице	
	let xx=x, count=pref_deck.length
	for (let i = 0; i < count; i++){
		set_attr(pref_deck[i][3],xx,y,pref_deck[i][2],'on_cl');i+1<count&&pref_deck[i][0]===pref_deck[i+1][0]?xx=xx+60:xx=xx+90		
	}
}

function deal_for_opponents(name, x, count,diff) {
	let w=document.documentElement.clientWidth,h=document.documentElement.clientHeight,y=20,y_diff=(h-160)/count
	for (let i = 0; i < count; i++){let id=name+i; 
		(w>=h||name==='buy_in')?(set_attr(id,x,y,'back_card','',diff),x=x+document.documentElement.clientWidth*.033):(set_attr(id,x,y,'back_card','',diff),y+=y_diff)
	}
}

function set_attr(id,x,y,id_path,on_cl,diff){
	card=document.createElementNS(svgns,'use');card.setAttributeNS(svg99,'xlink:href','#'+id_path);card.setAttributeNS(null,'x',x);
	card.setAttributeNS(null,'y',y);	
	if(diff){let s=diff*100+'%';
		if(diff<=1){card.setAttributeNS(null,'height',s);card.setAttributeNS(null,'width','100%')}
		else{card.setAttributeNS(null,'height','100%');card.setAttributeNS(null,'width',s)}
		}
	else{card.setAttributeNS(null,'height','100%');card.setAttributeNS(null,'width','100%')}
	card.setAttributeNS(null, 'id', id);if(on_cl){card.setAttributeNS(null,'onclick','select_cards(this)')};
	document.getElementById('new_brick').appendChild(card);
}

function deal_sec_pl(deck){
	let w=document.documentElement.clientWidth,h=document.documentElement.clientHeight, y_start=20
	if(w>=h){
		let m=[];m.push(deck.filter(i=>i[0]==='1Spades'));m.push(deck.filter(i=>i[0]==='2Clubs'));
		m.push(deck.filter(i=>i[0]==='3Diamonds'));m.push(deck.filter(i=>i[0]==='4Hearts'));m=m.filter(n=>n.length>0)		
		let y_diff=(h-190)/4
		for (let i=1;i<=m.length;i++){deal_cards(m[i-1],10,y_start);y_start+=y_diff}
	}
	else{
		let y_diff=(h-160)/deck.length
		for (let i=1;i<=deck.length;i++){deal_cards([deck[i-1]],10,y_start);y_start+=y_diff}
	}			
}

function deal_c_third_pl(deck){
	let w=document.documentElement.clientWidth,h=document.documentElement.clientHeight, y_start=20	
	if(w>=h){
		let m=[];m.push(deck.filter(i=>i[0]==='1Spades'));m.push(deck.filter(i=>i[0]==='2Clubs'));
		m.push(deck.filter(i=>i[0]==='3Diamonds'));m.push(deck.filter(i=>i[0]==='4Hearts'));m=m.filter(n=>n.length>0)
		let y_diff=(h-190)/4
		for (let i=1;i<=m.length;i++){deal_cards(m[i-1],w-50-(m[i-1].length*60),y_start);y_start+=y_diff}
	}
	else{
		let y_diff=(h-160)/deck.length
		for (let i=1;i<=deck.length;i++){deal_cards([deck[i-1]],w-110,y_start);y_start+=y_diff}
	}			
}

function disable_deck(d1,d2,d3,d4){
	if (d3.includes(d2)===true){d1.forEach(el=>{if(el[0]!==d2){document.getElementById(el[3]).style.opacity=0.6}})}
	else if (d3.includes(d2)===false&&d3.includes(d4)===true){d1.forEach(el=>{if(el[0]!==d4){document.getElementById(el[3]).style.opacity=0.6}})}
}

function disable_pas(trump,data){
	if(trump==='Вист'){for(let h in data){if(data[h][1]==='Пас'){data[h][3].forEach(el=>{document.getElementById(el[3]).style.opacity=0.6})}}}
	else if(trump==='Пас'){for(let h in data){if(data[h][1]==='Вист'){data[h][3].forEach(el=>{document.getElementById(el[3]).style.opacity=0.6})}}}	
	else{for(let h in data){data[h][3].forEach(el=>{document.getElementById(el[3]).style.opacity=0.6})}}
}

function set_hands(p_h,p1,p2,p3){	
	main_div.insertAdjacentHTML('beforeend', `<p style="position: absolute; left: 10px; bottom: 30px" id ="hand_player">${p_h[ p1.value]}</p>`)
	for (let p in p_h){
		if(hand_player.textContent==='1-я рука')
		{if(p_h[p]==='2-я рука'){p2.textContent=p+' '+p_h[p]}else if(p_h[p]==='3-я рука'){p3.textContent=p_h[p]+' '+p}}
		else if(hand_player.textContent==='2-я рука')
		{if(p_h[p]==='3-я рука'){p2.textContent=p+' '+p_h[p]}else if(p_h[p]==='1-я рука'){p3.textContent=p_h[p]+' '+p}}
		else if(hand_player.textContent==='3-я рука')
		{if(p_h[p]==='1-я рука'){p2.textContent=p+' '+p_h[p]}else if(p_h[p]==='2-я рука'){p3.textContent=p_h[p]+' '+p}}
	}
}

function trading(elem, num){
	let ev = document.getElementById('ev_wait')
	if (ev.textContent==='Заказывает'){
		if (hand_waiting.textContent.split(': ')[1]===hand_player.textContent){
			socket.emit('trade',[elem.id,elem.textContent,num,input_name.value,hand_player.textContent]);if (elem.id!=='pas'){inact_but('miser')}
		}
	}
	else if (ev.textContent==='Заказывает игру'){
		socket.emit('order', [elem.id, elem.textContent, hand_player.textContent, input_name.value, num, ev.textContent]);//trade_desk.remove()	
	}	
}

function change_name(name){
	name.insertAdjacentHTML('beforebegin', '<p style="font-size: 20pt" id ="alert_name">Если Вы хотите сменить имя, нажмите кнопку "Сменить свое имя"</p>')	
	join_game.disabled="disabled"; setTimeout(function(){join_game.disabled = false; alert_name.remove()},3000)
}

function data_from_cookie(name){
	let ind1 = document.cookie.lastIndexOf(name)+5, ind2 = document.cookie.match(/;/)		
	if (ind2!==null&&ind1 > ind2['index']){			
		var prName = document.cookie.substring(ind1); let ind2 = prName.match(/;/);	if (ind2!==null){prName = prName.substring(0, ind2['index'])}
	}
	else if  (ind2!==null&&ind1 < ind2['index']){var prName = document.cookie.substring(ind1, ind2['index'])}
	else if  (ind2===null){var prName = document.cookie.substring(ind1)}	
	return prName
}

function set_h_trump(data){
	let trump = [[hand_player.textContent,document.getElementById('trump1_id')],[sec_player.textContent.slice(-8),document.getElementById('trump2_id')],[third_player.textContent.slice(0,8),document.getElementById('trump3_id')]]	
	trump.forEach(i=>{if(i[1].textContent!==data[2][i[0]][1]){i[1].textContent=data[2][i[0]][1];
	i[1].textContent.slice(-1)==='♦'||i[1].textContent.slice(-1)==='♥'?i[1].style.color='red':i[1].style.color='black'}})	
}

function set_trick(data){
	let trick = [['trick1',hand_player.textContent],['trick2',sec_player.textContent.slice(-8)],['trick3',third_player.textContent.slice(0,8)]]
	if(!document.getElementById('trick1')){
	main_div.insertAdjacentHTML('beforeend','<p style="position:absolute; left:10px;bottom:90px" id="trick1">Взяток:</p>')}
	if(!document.getElementById('trick2')){
	trump2_id.insertAdjacentHTML('afterend','<p style="margin-left:10px" id="trick2">Взяток:</p>')}
	if(!document.getElementById('trick3')){
	trump3_id.insertAdjacentHTML('beforebegin','<p style="margin-right:10px" id="trick3">Взяток:</p>')}
	trick.forEach(i=>{let h_t=document.getElementById(i[0]);if (h_t.textContent.slice(-1)!=data[i[1]][4]){h_t.textContent=`Взяток: ${data[i[1]][4]}`}})
}

function sel_wist(el){socket.emit('order',[el.id, el.textContent, hand_player.textContent, input_name.value]);wist_desk.remove()}

function l_d(el){socket.emit('playing',[el.textContent, hand_player.textContent, input_name.value])}

function refresh_page (games, count_sec, count_third){ev_wait.textContent='Заказывает игру'	
	let w=document.documentElement.clientWidth-20,h=document.documentElement.clientHeight,diff=w/(h-20)-0.477
	deal_cards(games,100,h-166);
	let x;w+20>=h?x=w-((count_third+3)*w*.033):(x=w-120,diff=1)
	deal_for_opponents(sec_player.id,20,count_sec,diff);
	deal_for_opponents(third_player.id,x,count_third,diff);
}

function inact_trade_but(id, num){
	let but_id = [['6_S',0],['6_C',1],['6_D',2],['6_H',3],['6_BK',4],['7_S',5],['7_C',6],['7_D',7],['7_H',8],['7_BK',9],['8_S',10],['8_C',11],['8_D',12],['8_H',13],['8_BK',14],['miser', 15],['9_S',16],['9_C',17],['9_D',18],['9_H',19],['9_BK',20],['10_S',21],['10_C',22],['10_D',23],['10_H',24],['10_BK',25]]
	but_id.forEach(i=>{if (hand_player.textContent!=='1-я рука'&&id!=='pas'&&i[1]<=num){inact_but(i[0])}
	else if (hand_player.textContent==='1-я рука'&&id!=='pas'&&i[1]<num){inact_but(i[0])}})
}

function inact_but(id){let el = document.getElementById(id); if (!el.disabled){el.disabled="disabled";el.style.opacity = 0.4}}

function remove_cards(len, elem){let el;
	for (let i=0; i<len; i++){typeof(elem)==='object'?el=document.getElementById(elem[i][3]):el=document.getElementById(elem+i);if (el){el.remove()}}	
}

let sel = []
function select_cards(el){let ev = document.getElementById('ev_wait')	
	if (ev&&hand_waiting.textContent.substring(6)===hand_player.textContent&&ev.textContent==='сбрасывает карты'){
		if(sel.length===0){change_size(el, sel)}
		else if(sel.length===1&&el.id!==sel[0][0]){
			change_size(el, sel)
			main_div.insertAdjacentHTML('beforeend',`<button style="position: absolute; left: 650px; bottom: 160px; font-size: 33px" id="dis_cards" onclick="discard()">Сбросить</button>`)
		}
		else if(sel.length===1&&el.id===sel[0][0]){el.width.baseVal.value=sel[0][1];el.height.baseVal.value=sel[0][2];sel = []}
		else if(sel.length===2&&el.id!==sel[0][0]&&el.id!==sel[1][0]){
			sel.forEach(i=>{let old_el=document.getElementById(i[0]);old_el.width.baseVal.value=i[1];old_el.height.baseVal.value=i[2]})
			sel = []; change_size(el, sel); dis_cards.remove();
		}
	}
	else if (ev&&hand_waiting.textContent.substring(6)===hand_player.textContent&&ev.textContent==='ходит'&&el.style.opacity!=='0.6'){	
		if(sel.length===0){change_size(el, sel)}
		else if(sel.length===1&&el.id===sel[0][0]){let h,n;		
			koloda.forEach(i=>{if(i.includes(el.id)===true){h=i[0];n=i[1]}});socket.emit('playing',['run',h,n,sel[0][0]]);sel=[]			
		}
		else if(sel.length===1&&el.id!==sel[0][0]){let old_el=document.getElementById(sel[0][0]);
			old_el.width.baseVal.value=sel[0][1];old_el.height.baseVal.value=sel[0][2];sel = [];change_size(el, sel)
		} 		
	}
}

function change_size(el, sel){
	sel.push([el.id, el.width.baseVal.value, el.height.baseVal.value])
	el.width.baseVal.value=el.width.baseVal.value*1.1; el.height.baseVal.value=el.height.baseVal.value*1.1
}

function discard(){socket.emit('assign_game', ['discard', input_name.value, sel]); dis_cards.remove(); sel = []}

function pulya_look(el){
	if (document.getElementById('hand_player')&&el.textContent==='Посмотреть пулю'){socket.emit('playing', ['pulya',hand_player.textContent,input_name.value])}
	else if (!document.getElementById('hand_player')&&el.textContent!=='Закрыть окно'){console.log('Вы пока не в игре')}
	else if (el.textContent==='Закрыть окно'){
		let el=document.getElementById('pulya'); el.style.display==='none'?el.style.display='initial':el.style.display='none'
	}
}

function full_text(el){
	pulya.insertAdjacentHTML('afterbegin', `<p id="full_t" style="position:absolute; border:2px solid black; word-break:break-all; width:250px; left:${el.getBoundingClientRect().x}px; top:${el.getBoundingClientRect().y}px;background:aqua" onclick="close_window(this)">${el.lastChild.textContent}</p>`)	
}

function cut_text(el,str){
	let titl, e=document.getElementById(el[0]);str.length>el[1]?(e.textContent='...'+str.slice(str.length-el[1]+3),titl=document.createElementNS(svgns,'title'),titl.setAttributeNS(null,'id','f_t'),titl.textContent=str,e.appendChild(titl)):e.textContent=str
}

function add_join_window(data,butt,p){
	if(!document.getElementById('join_window')){main_div.insertAdjacentHTML('beforeend','<div id="join_window"></div>')}
	if(data.length!==0){join_window.style.display='initial'
		let add=[],a,b;data.map(i=>{			
			a=`pl_${i[1]}`;i[2]?b=`  Пуля до ${i[0][0]}, ждем ход - ${i[0][1]}сек: <b onclick="statistic(this)">${i[1]}</b> + <b onclick="statistic(this)">${i[2]}</b>`:b=`  Пуля до ${i[0][0]}, ждем ход - ${i[0][1]}сек:  <b onclick="statistic(this)">${i[1]}</b>`
			add.push(join_str(a,b))
		})
		add.forEach(i=>{join_window.insertAdjacentHTML('beforeend',i)})
		for (let i=0;i<data.length;i++){			
			if(data[i][1]===p.value){butt.textContent='Отменить создание';p.disabled=true;break}
			else if(data[i][2]===p.value){butt.textContent='Выйти';p.disabled=true;break}else{butt.textContent='Создать игру'}
		}		
	}
	else{butt.textContent='Создать игру'}
}

function check_n(el){if (el.value<0){el.value=1}else if(el.value>1000){el.value=1000};el.value=el.value.replace(/[^0-9]/g,'')}

const join_str=(a,b)=>`<p class="join_el" id="${a}"><span onclick="j_game(this)">Присоединиться</span>${b}</p>`

function j_game(el){//нажатие кнопки присоединиться к игре или создать игру	
	let but_n=document.getElementById('but_name'), name=document.getElementById('input_name');
	if(data_from_cookie('user=')){
		if(data_from_cookie('user=')!==name.value){change_name(name)}
		else{
			if((el.textContent==='Создать игру')&&check_name(name)!=1){name.disabled=true;main_div.insertAdjacentHTML('beforeend',initial_window)}
			if(el.textContent==='Создать'){join_game.disabled=true
				if(fin_pulya.value==0||fin_pulya.value==''){fin_pulya.value=10};if(seconds.value==0||seconds.value==''){seconds.value=20};
				socket.emit('join',[name.value,'Создать игру',fin_pulya.value,seconds.value]);close_window()
			}		
			else if(el.textContent.slice(0,14)==='Присоединиться'&&name.value!=''&&check_name(name)!=1){
				join_game.disabled=true;socket.emit('join',[name.value,el.textContent,el.parentNode.id,el.parentNode.innerHTML])
			}
			else if(el.textContent==='Отменить создание'){el.disabled=true;socket.emit('join',[name.value,el.textContent])}
			else if(el.textContent==='Выйти'){el.disabled=true;
				let b,s,j=join_window.getElementsByClassName('join_el')	
				if(j){for(let i=0;i<j.length;i++){b=j[i].getElementsByTagName('b');if(b.length==2&&b[1].textContent===name.value){s=b[0].textContent}}
				socket.emit('join',[name.value,el.textContent,s])
				}
			}
			else if(el.textContent==='Закончить игру'){socket.emit('join',[name.value,el.textContent])}		
		}
	}
	else{but_n.insertAdjacentHTML('afterend','<p style="margin-block-start:-1px;margin-inline-start:10px"id="waiting">Перед началом игры придумайте себе имя</p>')}
}

function change_size_window(){
let w=(document.documentElement.clientWidth-20),h= (document.documentElement.clientHeight-20),s=`0 0 ${w} ${h}`
		socket.emit('open_page', ['w: '+w,'h: '+h])
		new_brick.setAttribute("height",h+'px');new_brick.setAttribute("width",w+'px')		
		id_all_symbols.forEach(i=>{document.getElementById(i).setAttribute("viewBox",s)})
}

function reload(){window.location.reload(true)}

const initial_window = `<div id="pass_inf">
<p>Если один из игроков отключится, за него продолжит играть Бот. Решите, сколько секунд потребуется на раздумья, пока Бот не начнет ходить. Игрок всегда сможет перехватить управление.</p>
<p><label for="s">Думаем в секундах до: </label><input style="width:100px" value="20" type="number" name="s" id="seconds" oninput="check_n(this)"/></p>
<p><label for="q">Играем пулю до: </label><input style="width:100px" value="10" type="number" name="q" id="fin_pulya" oninput="check_n(this)"/></p>
<p>
	<button onclick="j_game(this)">Создать</button>
	<button id = "close_window"  onclick="close_window()">Закрыть окно</button>
</p>
</div>`,

id_all_symbols=['back_card','7_Clubs','7_diamonds','7_Hearts','7_Spades','8_Clubs','8_diamonds','8_Hearts','8_Spades','9_Clubs','9_diamonds','9_Hearts','9_Spades','10_Clubs','10_diamonds','10_Hearts','10_Spades','A_Clubs','A_diamonds','A_Hearts','A_Spades','J_Clubs','J_diamonds','J_Hearts','J_Spades','Q_Clubs','Q_diamonds','Q_Hearts','Q_Spades','K_Clubs','K_diamonds','K_Hearts','K_Spades']

