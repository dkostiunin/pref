import {search_players_by_name,users,sorting,temp_data,games,upd_user,catch_err,con_mongo,client,dbase} from './chat.js';
export default async function func_trade(elem,g,io){
	g.trump[elem[4]]=[elem[0],elem[1],elem[2],elem[3]];set_trump(g, elem, elem[2], elem[4])
	search_players_by_name (elem[3], [elem[0], elem[2], elem[4], g.trump, elem[1]], 'trade')//рассылаем игрокам данные о ходе торговли
	let count=0,zakaz=0,n_g=users.get(elem[3])[2],update_trade_data=temp_data.get(n_g).trade;
	update_trade_data[0]='pas';update_trade_data[1]='Пас';update_trade_data[2]=26;
	update_trade_data[3]=Object.keys(g.hands)[Object.values(g.hands).indexOf(g.trump.n_hand[0].slice(6))]
	update_trade_data[4]=g.trump.n_hand[0].slice(6);
	for (let key in g.trump){
		if (g.trump[key][0]==='pas'){count++}
		else if (g.trump[key][0]!==undefined&&g.trump[key][0]!=='pas'&&key!=='n_hand'&&key!=='stat'){zakaz++}
	}
	if (count===2&&zakaz===1){let gamer;
		for (let h in g.trump){
			if (g.trump[h][0]!=='pas'&&h!=='n_hand'&&h!=='stat'){g[g.trump[h][3]]=sorting(g[g.trump[h][3]].concat(g.deck));gamer=g.trump[h][3]}
			if (h!=='n_hand'&&h!=='stat'){g.trump[h].push(g[g.trump[h][3]].length)}// что это???
		}
		g.trump.stat='drop'; search_players_by_name (gamer,['назначить игру', g.deck, '<p style="position: absolute; left: 570px; bottom: 450px; font-size: 25px;" id = "timer"></p>'], 'assign_game')
		setTimeout(()=>{let gm,pl,n=users.get(gamer);
			n?pl=gamer:(gm=games.get(n_g),pl=gm.bot[1][gm.bot[0].indexOf(gm.bot[0].find(i=>i===gamer))])			
			search_players_by_name(pl,['stop',pl,g.deck],'assign_game');if(n){io.to(users.get(pl)[0]).emit('assign_game',['take_ransom',g[pl]])}
		},5000)
	}		
	else if (count===3){
		let update_data=temp_data.get(users.get(elem[3])[2]).playing;
		g.trump.stat='playing';g.trump.n_hand[0]='Ждем: 1-я рука';g.trump.n_hand[1]='распасовка'
		for (let h in g.trump){if (h!=='n_hand'&&h!=='stat'){
			g.trump[h].push(0);g.trump[h][2]=10};upd_user(g.trump[h][3],{$inc:{'res.raspas.all':1}}).catch(err=>{catch_err(err)})
		}
		search_players_by_name (elem[3],['распасовка',g.deck[0],g.trump,'распасовка'], 'playing')
		let gamer=g.trump['1-я рука'][3], cards=g[gamer].map(item=>item[0])
		io.to(users.get(gamer)[0]).emit('playing',['disable',g[gamer],g.deck[0][0],cards,g.trump.n_hand[1]])
		update_data[0]='run';update_data[1]='1-я рука';update_data[2]=g.trump['1-я рука'][3];
		let card=g[g.trump['1-я рука'][3]].find(i=>i[0]===g.deck[0][0])
		if(card){update_data[3]=card[3]}
		else{let s=g[g.trump['1-я рука'][3]];update_data[3]=s[s.map(i=>i[1]).indexOf(Math.min(...s.map(i=>i[1])))][3]}
	}
}

function set_trump(g, elem, num, hand) {let h1,h2;
	if (hand==='1-я рука'){h1=2; h2=3} else if (hand==='2-я рука'){h1=3; h2=1} else if (hand==='3-я рука'){h1=1; h2=2}
	if (g.trump[`${h1}-я рука`][0]!=='pas'){
		elem[0]!=='pas'?g.trump.n_hand=[`Ждем: ${h1}-я рука`,elem[0],num]:g.trump.n_hand[0]=`Ждем: ${h1}-я рука`
	}
	else if (g.trump[`${h1}-я рука`][0]==='pas'&&g.trump[`${h2}-я рука`][0]!=='pas'){
		elem[0]!=='pas'?g.trump.n_hand=[`Ждем: ${h2}-я рука`,elem[0],num]:g.trump.n_hand[0]=`Ждем: ${h2}-я рука`
	}
	if (!g.trump.n_hand[1]){g.trump.n_hand[1]='pas'}	
}	