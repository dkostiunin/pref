import {search_players_by_name,users,temp_data,upd_user,catch_err,con_mongo,client,dbase} from './chat.js';
import {wist,l_d} from './constants.js';import count_pulya from './chat_fin_count_pulya.js'
export default async function assign_order(data,g,io){let sock,upd_data=temp_data.get(users.get(data[3])[2]).order
	const f_hand=data[2]
	if (data[5]==='Заказывает игру'){
		if (data[2]==='1-я рука'){g.trump.n_hand[0]='Ждем: 2-я рука'; sock=users.get(g.trump['2-я рука'][3])[0]}
		else if (data[2]==='2-я рука'){g.trump.n_hand[0]='Ждем: 3-я рука'; sock=users.get(g.trump['3-я рука'][3])[0]}
		else if (data[2]==='3-я рука'){g.trump.n_hand[0]='Ждем: 1-я рука'; sock=users.get(g.trump['1-я рука'][3])[0]}
		g.trump.stat='wist'; g.trump.n_hand[1]=data[0]; g.trump.n_hand[2]=data[2]			
		g.trump[data[2]][0]=data[0];g.trump[data[2]][1]=data[1];let t=g.trump.n_hand[1][g.trump.n_hand[1].length-1]
		if(t==='S'){g.trump.n_hand[1]='1Spades'}else if(t==='C'){g.trump.n_hand[1]='2Clubs'}else if(t==='D'){g.trump.n_hand[1]='3Diamonds'}
		else if(t==='H'){g.trump.n_hand[1]='4Hearts'}else if(t==='K'){g.trump.n_hand[1]='BK'}else(g.trump.n_hand[1]='Мизер')
		if(data[1].slice(0,2)==10||g.trump.n_hand[1]==='Мизер'){let vl,gm,v={},upd_d_p=temp_data.get(users.get(data[3])[2]).playing,n_p=g.trump['1-я рука'][3]
			upd_d_p[0]='run';upd_d_p[1]='1-я рука';upd_d_p[2]=n_p;
			for (let h in g.trump){
				if (h!==data[2]&&h!=='n_hand'&&h!=='stat'){
					g.trump[h][0]='В светлую';g.trump[h][1]='Пас';g.trump[h][2]=10;g.trump[h][4]=0;v[h]=[h,g.trump[h][1],g.trump[h][3],g[g.trump[h][3]]]
				}
				else if (h===data[2]){g.trump[h][0]='В светлую';g.trump[h][2]=10;g.trump[h][4]=0}
			}
			if(data[1].slice(0,2)==10){gm=10;g.trump.n_hand[3]=10;upd_d_p[3]=g[n_p].find(i=>i[1]===Math.max.apply(null,g[n_p].map(i=>i[1])))[3]}
			else if(g.trump.n_hand[1]==='Мизер'){
				gm='miser';g.trump.n_hand[3]='Мизер';upd_d_p[3]=g[n_p].find(i=>i[1]===Math.min.apply(null,g[n_p].map(i=>i[1])))[3]
			}
			g.trump.stat='playing';g.trump.n_hand[0]='Ждем: 1-я рука';search_players_by_name(data[3],['игра',data,g.trump,10,v],'playing')
			for(let i in g.hands){
				g.trump[g.hands[i]][1]==='Пас'?vl=`res.${gm}p.all`:vl=`res.${gm}g.all`;upd_user(i,{$inc:{[vl]:1}}).catch(err=>{catch_err(err)})
			}
		}
		else{
			for (let h in g.trump){
				if (h!==data[2]&&h!=='n_hand'&&h!=='stat'){g.trump[h][0]=undefined;g.trump[h][1]=undefined;g.trump[h][2]=10;g.trump[h][4]=0}
				else if (h===data[2]){g.trump[h][2]=10;g.trump[h][4]=0}
			}
			search_players_by_name (data[3],['вист',data,g.trump],'order');io.to(sock).emit('order',['wist_full',wist])
		}
		let hand=g.trump.n_hand[0].slice(6)		
		upd_data[0]='pas';upd_data[1]='Пас';upd_data[2]=hand;upd_data[3]=g.trump[hand][3];
		if(upd_data[5]){upd_data.pop()};if(upd_data[4]){upd_data.pop()}
	}
	else{
		let t=[],game=g.trump[g.trump.n_hand[2]][0].slice(0,1);g.trump[data[2]][0]=data[0];g.trump[data[2]][1]=data[1];			
		for (let h in g.trump){
			if (g.trump[h][0]===undefined||g.trump[h][0]==='pas'||g.trump[h][0]==='wist_full'||g.trump[h][0]==='wist_half'){
				t.push(g.trump[h][0]);
				if (h!==f_hand){sock=users.get(g.trump[h][3])[0];g.trump.n_hand[0]='Ждем: '+h;
					(upd_data[0]==='pas'&&(game==6||game==7))?(upd_data[0]='wist_half',upd_data[1]='Пол виста'):(upd_data[0]='pas',upd_data[1]='Пас')
					upd_data[2]=h;upd_data[3]=g.trump[h][3];
				}
			}
		}
		if (t.includes('wist_full')===true&&t.includes(undefined)===true){
			search_players_by_name (data[3],['вист',data,g.trump],'order'); io.to(sock).emit('order',['wist_full',wist,g.trump])
		}
		else if (t.includes('wist_full')===true&&t.includes('pas')===true){g.trump.stat='l_d';
			for (let h in g.trump){
				if (g['trump'][h][0]==='wist_full'){
					h===g.trump.n_hand[0].substring(6)?search_players_by_name (data[3],['вист',data,g.trump],'order'):g.trump.n_hand[0]='Ждем: '+h
					io.to(users.get(g.trump[h][3])[0]).emit('order',['l_d',l_d])
					upd_data[0]='В темную';upd_data[1]=h;upd_data[2]=g.trump[h][3];
				}
			}
		}
		else if (t.includes('wist_full')===true&&t.includes('pas')===false&&t.includes('undefined')===false&&t.includes('wist_half')===false){
			g.trump.stat='playing';g.trump.n_hand[0]='Ждем: 1-я рука';let upd_d_p=temp_data.get(users.get(data[3])[2]).playing,n_p=g.trump['1-я рука'][3];search_players_by_name (data[3],['игра',data,g.trump,'В темную'], 'playing')
			upd_d_p[0]='run';upd_d_p[1]='1-я рука';upd_d_p[2]=n_p;upd_d_p[3]=g[n_p].find(i=>i[1]===Math.max.apply(null,g[n_p].map(i=>i[1])))[3]
			let gm=parseInt(g.trump[g.trump.n_hand[2]][1],10),vl;
			for(let i in g.hands){
				g.trump[g.hands[i]][1]==='Вист'?vl=`res.${gm}w.all`:vl=`res.${gm}g.all`;upd_user(i,{$inc:{[vl]:1}}).catch(err=>{catch_err(err)})
			}
		}
		else if (t.includes('wist_full')===true&&t.includes('wist_half')===true){g.trump.stat='l_d'
			for (let h in g.trump){
				if (g.trump[h][0]==='wist_half'){g.trump[h][0]='pas';g.trump[h][1]='Пас'}
				if (g.trump[h][0]==='wist_full'){
					g.trump.n_hand[0]='Ждем: '+h;io.to(users.get(g.trump[h][3])[0]).emit('order',['l_d',l_d])
					upd_data[0]='В темную';upd_data[1]=h;upd_data[2]=g.trump[h][3];
				}
			}
			search_players_by_name(data[3],['вист',data,g.trump],'order')
		}
		else if (t.includes('pas')===true&&t.includes(undefined)===true){
			search_players_by_name (data[3],['вист',data,g.trump],'order'); io.to(sock).emit('order',['pas',wist,g.trump])
		}
		else if (t.includes('pas')===true&&t.includes('wist_half')===true&&data[0]==='wist_half'){
			search_players_by_name (data[3],['вист',data,g.trump],'order'); io.to(sock).emit('order',['wist_full',wist,g.trump])
		}
		else if ((t.includes('pas')===true&&t.includes('wist_half')===true&&data[0]==='pas')||(t.includes('pas')===true&&t.includes('wist_half')===false&&data[0]==='pas')){
			let wist_half
			for (let h in g.trump){if (h==='n_hand'||h==='stat'){continue};
				if(g.trump[h][0]==='wist_half'){wist_half=h}
				else if(g.trump[h][0]!=='wist_half'&&g.trump[h][0]!=='pas'){g.trump[h][4]=game}
			}
			if(wist_half){g.trump[wist_half][4]=(game==6)?2:1}
			let gm=parseInt(g.trump[g.trump.n_hand[2]][1],10),vl;
			for(let i in g.hands){
				(g.trump[g.hands[i]][1]==='Пас'||g.trump[g.hands[i]][1]==='Пол виста')?vl=`res.pas`:vl=`res.${gm}g.all`;
				upd_user(i,{$inc:{[vl]:1}}).catch(err=>{catch_err(err)})
			}
			count_pulya([data[0],data[1],data[3]],g,io)
		}			
	}	
}			