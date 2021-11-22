import {search_players_by_name,temp_data,users} from './chat.js';
export default async function run1(data,g,io){
	for (let i=0;i<g[data[2]].length;i++){
		if(g[data[2]][i][3]===data[3]){
			g.used_cards.push([data[1],g[data[2]][i]]);
			g.trump[data[1]][2]=g[data[2]].length-1//в этой операции иногда возникает ошибка отсчет идет от 12
			if (g.used_cards.length<3){
				if(g.trump.n_hand[0]==='Ждем: 1-я рука'){g.trump.n_hand[0]='Ждем: 2-я рука'}
				else if(g.trump.n_hand[0]==='Ждем: 2-я рука'){g.trump.n_hand[0]='Ждем: 3-я рука'}
				else if(g.trump.n_hand[0]==='Ждем: 3-я рука'){g.trump.n_hand[0]='Ждем: 1-я рука'}	
				let gamer=Object.keys(g.hands).find(k=>g.hands[k]===g.trump.n_hand[0].substring(6)), cards=g[gamer].map(i=>i[0])
				if (g.trump.n_hand[1]==='распасовка'&&g[data[2]].length===10){
					io.to(users.get(gamer)[0]).emit('playing',['disable',g[gamer],g.deck[0][0],cards,g.trump.n_hand[1]])
				}
				else if (g.trump.n_hand[1]==='распасовка'&&g[data[2]].length===9){
					io.to(users.get(gamer)[0]).emit('playing',['disable',g[gamer],g.deck[1][0],cards,g.trump.n_hand[1]])
				}
				else{
					if (g.trump[data[1]][0]==='В светлую'){let v={},vist_pl;
						for (let h in g.trump){
							if(g.trump[h][1]==='Вист'){vist_pl=g.trump[h][3]}
							if(g.trump[h][1]==='Вист'||g.trump[h][1]==='Пас'){v[h]=[h,g.trump[h][1],g.trump[h][3],g[g.trump[h][3]]]}
						}						
						if(vist_pl&&g.trump[g.hands[gamer]][1]==='Пас'){
							io.to(users.get(vist_pl)[0]).emit('playing',['disable',g[gamer],g.used_cards[0][1][0],cards,g.trump.n_hand[1],v,g.trump[g.hands[gamer]][1],g.trump.n_hand[3]])}
						else{
							io.to(users.get(gamer)[0]).emit('playing',['disable',g[gamer],g.used_cards[0][1][0],cards,g.trump.n_hand[1],v,g.trump[g.hands[gamer]][1],g.trump.n_hand[3]])}
					}
					else{
						io.to(users.get(gamer)[0]).emit('playing',['disable',g[gamer],g.used_cards[0][1][0],cards,g.trump.n_hand[1]])}
				}
			}
			else if (g.used_cards.length===3){let c
				if(g.trump.n_hand[1]==='распасовка'&&g[data[2]].length===10){c=g.used_cards.filter(it=>it[1][0]===g.deck[0][0]).slice()}
				else if(g.trump.n_hand[1]==='распасовка'&&g[data[2]].length===9){c=g.used_cards.filter(it=>it[1][0]===g.deck[1][0]).slice()}
				else {c=g.used_cards.slice()};
				c.map(item=>item[1][0]).includes(g.trump.n_hand[1])===false?g.trump.n_hand[0]='Ждем: '+c.filter(item=>item[1][0]===c[0][1][0]).find(el=>el[1][1]===Math.max.apply(null,c.filter(pos=>pos[1][0]===c[0][1][0]).map(num=>num[1][1])))[0]:g.trump.n_hand[0]='Ждем: '+c.filter(item=>item[1][0]===g.trump.n_hand[1]).find(el=>el[1][1]===Math.max.apply(null,c.filter(pos=>pos[1][0]===g.trump.n_hand[1]).map(num=>num[1][1])))[0]; 
				g.trump[g.trump.n_hand[0].substring(6)][4]++
				if(g.trump.n_hand[1]==='распасовка'&&(g[data[2]].length===10||g[data[2]].length===9)){g.trump.n_hand[0]='Ждем: 1-я рука'}
			}
			search_players_by_name (data[2],['run',data,g.trump,g[data[2]][i],g[data[2]].length,g.used_cards],'playing');
			g[data[2]].splice(i,1); break;
		}
	}
	if (g.used_cards.length===3){g.used_cards=[];let v={}
		if (g.trump['1-я рука'][0]==='В светлую'){
			for (let h in g.trump){
				if(g.trump[h][1]==='Вист'||g.trump[h][1]==='Пас'){v[h]=[h,g.trump[h][1],g.trump[h][3],g[g.trump[h][3]]]}
			}
		}
		for (let h in g.hands){
			if(g.trump.n_hand[1]==='распасовка'&&(g[h].length===9||g[h].length===8)){
				io.to(users.get(h)[0]).emit('playing',['retake',g[h],g.deck,g[h].length])
			}
			else if(g.trump['1-я рука'][0]==='В светлую'){
				io.to(users.get(h)[0]).emit('playing',['retake',g[h],'В светлую',v,g.trump[g.trump.n_hand[0].slice(6)][1],g.trump.n_hand[3]])
			}
			else{io.to(users.get(h)[0]).emit('playing',['retake',g[h]])}
		}
		if(g.trump.n_hand[1]==='распасовка'&&g[data[2]].length===9){
			let gamer=g.trump['1-я рука'][3], cards=g[gamer].map(it=>it[0])
			io.to(users.get(gamer)[0]).emit('playing',['disable',g[gamer],g.deck[1][0],cards,g.trump.n_hand[1]])
		}
	}
	let n_p=g.trump[g.trump.n_hand[0].substring(6)][3];
	if(g[n_p].length>0){
	let update_data=temp_data.get(users.get(data[2])[2]).playing;
	const upd_max=()=>{update_data[3]=g[n_p].find(i=>i[1]===Math.max.apply(null,g[n_p].map(i=>i[1])))[3]}
	const upd_min=()=>{update_data[3]=g[n_p].find(i=>i[1]===Math.min.apply(null,g[n_p].map(i=>i[1])))[3]}
		update_data[0]='run';update_data[1]=g.trump.n_hand[0].substring(6);update_data[2]=n_p;
		if (g.trump.n_hand[1]==='распасовка'&&g[n_p].length===10){
			g[n_p].map(i=>i[0]).includes(g.deck[0][0])===true?update_data[3]=g[n_p].find(i=>i[0]===g.deck[0][0])[3]:upd_max()
		}
		else if (g.trump.n_hand[1]==='распасовка'&&g[n_p].length===9){
			g[n_p].map(i=>i[0]).includes(g.deck[1][0])===true?update_data[3]=g[n_p].find(i=>i[0]===g.deck[1][0])[3]:upd_max()
		}
		else{
			if (g.used_cards.length===0){g.trump.n_hand[1]==='распасовка'||g.trump.n_hand[1]==='Мизер'?upd_min():upd_max()}
			else{
				if(g[n_p].map(i=>i[0]).includes(g.used_cards[0][1][0])===true){
				g.trump.n_hand[1]==='распасовка'||g.trump.n_hand[1]==='Мизер'?update_data[3]=g[n_p].find(i=>i[0]===g.used_cards[0][1][0])[3]:(update_data[3]=g[n_p].reverse().find(i=>i[0]===g.used_cards[0][1][0])[3],g[n_p].reverse());
				}
				else if(g[n_p].map(i=>i[0]).includes(g.used_cards[0][1][0])===false){
					if(g.trump.n_hand[1]==='распасовка'||g.trump.n_hand[1]==='Мизер'){upd_max()}
					else{g[n_p].map(i=>i[0]).includes(g.trump.n_hand[1])===true?update_data[3]=g[n_p].find(i=>i[0]===g.trump.n_hand[1])[3]:upd_min()}
				}
			}
		}
	}
}