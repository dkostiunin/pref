export const trade=`<div id = "trade_desk" style="position: absolute; left: 325px; top: 70px">	
	<p style="margin-bottom:10px; margin-left:110px; font-size: 25px;">Торговля</p>			
	<ul>
		<li>
			<button style="width:50px; color:black" id = "6_S" onclick="trading(this, 0)">6&#9824;</button>
			<button style="width:70px; color:black; float: right" id = "6_BK" onclick="trading(this, 4)">6БК</button>
			<button style="width:50px; color:red; float: right" id = "6_H" onclick="trading(this, 3)">6&#9829;</button>
			<button style="width:50px; color:red; float: right" id = "6_D" onclick="trading(this, 2)">6&#9830;</button>
			<button style="width:50px; color:black; float: right" id = "6_C" onclick="trading(this, 1)">6&#9827;</button>
		</li>
		<li>
			<button style="width:50px;color:black" id = "7_S" onclick="trading(this, 5)">7&#9824;</button>
			<button style="width:70px;color:black; float: right" id = "7_BK" onclick="trading(this, 9)">7БК</button>
			<button style="width:50px;color:red; float: right" id = "7_H" onclick="trading(this, 8)">7&#9829;</button>
			<button style="width:50px;color:red; float: right" id = "7_D" onclick="trading(this, 7)">7&#9830;</button>
			<button style="width:50px;color:black; float: right" id = "7_C" onclick="trading(this, 6)">7&#9827;</button>
		</li>
		<li>
			<button style="width:50px;color:black" id = "8_S" onclick="trading(this, 10)">8&#9824;</button>
			<button style="width:70px;color:black; float: right" id = "8_BK" onclick="trading(this, 14)">8БК</button>
			<button style="width:50px;color:red; float: right" id = "8_H" onclick="trading(this, 13)">8&#9829;</button>
			<button style="width:50px;color:red; float: right" id = "8_D" onclick="trading(this, 12)">8&#9830;</button>
			<button style="width:50px;color:black; float: right" id = "8_C" onclick="trading(this, 11)">8&#9827;</button>
		</li>
		<li>
			<button style="width:50px;color:black"; id = "9_S" onclick="trading(this, 16)">9&#9824;</button>
			<button style="width:70px;color:black; float: right" id = "9_BK" onclick="trading(this, 20)">9БК</button>
			<button style="width:50px;color:red; float: right" id = "9_H" onclick="trading(this, 19)">9&#9829;</button>
			<button style="width:50px;color:red; float: right" id = "9_D" onclick="trading(this, 18)">9&#9830;</button>
			<button style="width:50px;color:black; float: right"id = "9_C" onclick="trading(this, 17)">9&#9827;</button>
		</li>
		<li>
			<button style="width:50px;color:black; padding: 1px;" id = "10_S" onclick="trading(this, 21)">10&#9824;</button>
			<button style="width:70px;color:black; float: right" id = "10_BK" onclick="trading(this, 25)">10БК</button>
			<button style="width:50px;padding: 1px; color:red; float: right" id = "10_H" onclick="trading(this, 24)">10&#9829;</button>
			<button style="width:50px;color:black; padding: 1px; color:red; float: right" id = "10_D" onclick="trading(this, 23)">10&#9830;</button>
			<button style="width:50px;color:black; padding: 1px; float: right" id = "10_C" onclick="trading(this, 22)">10&#9827;</button>
		</li>
		<li>
			<button style="width:135px;color:black; padding: 1px;" id = "pas" onclick="trading(this, 26)">Пас</button>
			<button style="width:135px;color:black; float: right" id = "miser" onclick="trading(this, 15)">Мизер</button>					
		</li>
	</ul>	
</div>`,

pass_inf1 = `<div id="pass_inf"><p id="passwrd">Ваш пароль "`,
pass_inf2 = `", запомните или запишите его</p>	
<p>Пароль хранится в куках браузера, если Вы очистите куки, или захотите поиграть на другом устройстве, или в другом браузере, то пароль потребуется для востановления игры</p>
<p>Вы можете поменять пароль</p>	
<input type="text" maxlength="25" id="new_pass" placeholder="Введите новый пароль"/>
<button id = "but_pas" onclick="but_pass()">Запомнить новый пароль</button>
<button id = "close_window"  onclick="close_window()">Закрыть окно</button>
</div>`,

pass_inf3 = `<div id="pass_inf">
<p>Игрок с таким именем уже не существует, вероятно, имя было изменено, для авторизации в предыдущем аккаунте введите новое имя, и нажмите кнопку "Сменить свое имя"</p><p>Сейчас создан новый игрок c этим именем, новый пароль "`,
pass_inf4 = `", запомните или запишите его</p>
<p>Вы можете поменять пароль</p>	
<input type="text" maxlength="25" id="new_pass" placeholder="Введите новый пароль"/>
<button id = "but_pas" onclick="but_pass()">Запомнить новый пароль</button>
<button id = "close_window"  onclick="close_window()">Закрыть окно</button>
</div>`,

in_g = `<div id="pass_inf">
<p>Игрок с Вашим именем уже в игре</p>
<p>Если хотите играть на этом устройстве, обновите страницу</p>
<button id = "close_window"  onclick="close_window('in_game')">Закрыть окно</button>
</div>`,

wist = `<div id="wist_desk">
	<ul>			
		<li><button id="wist_full" onclick="sel_wist(this)">Вист</button></li>
		<li><button disabled="disabled" id="wist_half" onclick="sel_wist(this)">Пол виста</button></li>
		<li><button id="pas" onclick="sel_wist(this)">Пас</button></li>
	</ul>
</div>`,

l_d = `<div id="light_dark">
	<ul>			
		<li><button onclick="l_d(this)">В светлую</button></li>
		<li><button onclick="l_d(this)">В темную</button></li>
	</ul>
</div>`,

card_id = ['card_1','card_2','card_3','card_4', 'card_5','card_6','card_7','card_8', 'card_9','card_10','card_11','card_12', 'card_13','card_14','card_15','card_16','card_17','card_18','card_19','card_20', 'card_21','card_22','card_23','card_24', 'card_25','card_26','card_27','card_28', 'card_29','card_30','card_31','card_32'],

join_str=(a,b)=>`<p class="join_el" id="${a}"><span onclick="j_game(this)">Присоединиться</span>${b}</p>`,

results={'6g':{'all':0,'win':0},'7g':{'all':0,'win':0},'8g':{'all':0,'win':0},'9g':{'all':0,'win':0},'10g':{'all':0,'win':0},'miserg':{'all':0,'win':0},
	'6w':{'all':0,'win':0},'7w':{'all':0,'win':0},'8w':{'all':0,'win':0},'9w':{'all':0,'win':0},'10p':{'all':0,'win':0},'pas':0,
	'miserp':{'all':0,'win':0},'raspas':{'all':0,'win':0},'buyinesc':0,'pul':{'all':0,'win':0,'escape':0},'total':0
}