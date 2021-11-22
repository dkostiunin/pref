import {trade,pass_inf1,pass_inf2,pass_inf3,pass_inf4,card_id,join_str,wist,l_d,in_g,results} from './constants.js'
import {h1,h2,h2_2,h3,h4,h5,h5_5,h6,h6_6,h7,h7_7,h8,h8_8,h9,h10,h11} from './help.js'//,h12,h13,h14,h15
import run from './chat_run.js';import count_pulya from './chat_fin_count_pulya.js';import func_trade from './chat_trade.js';
import assign_order from './chat_assign_order.js';
import {default as mongodb} from 'mongodb';import path from 'path';

import express from 'express';import {default as http_base} from 'http';import {default as io_base} from 'socket.io';
const app=express(),http=http_base.createServer(app),io=io_base(http),MongoClient=mongodb.MongoClient, __dirname = path.resolve(),PORT=process.env.PORT||80;
app.use(express.static(".")); app.get('/', (req, res) => {res.sendFile (__dirname + '/pref/index.html' )})

export const client=new MongoClient('mongodb+srv://dbuser:81601312@cluster0.vcupc.mongodb.net/pref?retryWrites=true&w=majority');
const event_close = "serverOpening", event_open = "serverClosed";
client.on(event_close,ev=>{console.log(40,`received ${event_close}: ${JSON.stringify(ev, null, 2)}`)})
client.on(event_open,ev=>{console.log(45,`received ${event_open}: ${JSON.stringify(ev, null, 2)}`)})
export const users=new Map(),pp=new Map(),games=new Map(),temp_data=new Map(),visitors=new Map(),timerId={}
export let dbase;let count_game=0

export async function con_mongo(){await client.connect();console.log('Connected');dbase=client.db('pref').collection('users')};con_mongo()

io.on('connection', (socket) => {
	io.to(socket.id).emit('join',['подключился',socket.id]); 
	console.log ('yes conns',visitors.size)
	
	socket.on ('disconnect', function(data){
		search_user_in_game(socket.id,'отключился от игры','join');console.log(21,'conns fail')
		for (let [k,v] of visitors){if (v[0]===socket.id){visitors.delete(k);io.emit('join',[visitors.size,'онлайн']);break}}
	})
	
	socket.on ('open_page', function(data){
		let pl=users.get(data),g;if(pl){pl[0]=socket.id;g=games.get(pl[2])}
		if (g){
			if (g.trump.stat=='trade'||g.trump.stat=='drop'||g.trump.stat=='order'){io.to(socket.id).emit('open_page',g[data],g.hands,trade,g.trump)}
			else if (g.trump.stat==='wist'){io.to(socket.id).emit('open_page', g[data], g.hands, wist, g.trump)}
			else if (g.trump.stat==='l_d'){io.to(socket.id).emit('open_page', g[data], g.hands, l_d, g.trump)}
			else if (g.trump.stat==='playing'){let n=g.trump['1-я рука'][4]+g.trump['2-я рука'][4]+g.trump['3-я рука'][4]
				if(n===0&&g.trump.n_hand[1]==='распасовка'){io.to(socket.id).emit('open_page',g[data],g.hands,g.used_cards,g.trump,g.deck[0],n)}
				else if(n===1&&g.trump.n_hand[1]==='распасовка'){io.to(socket.id).emit('open_page',g[data],g.hands,g.used_cards,g.trump,g.deck[1],n)}
				else{
					if(g.trump['1-я рука'][0]==='В светлую'){let v={}
						for (let h in g.trump){
							if(g.trump[h][1]==='Вист'||g.trump[h][1]==='Пас'){v[h]=[h,g.trump[h][1],g.trump[h][3],g[g.trump[h][3]]]}
						}
						io.to(socket.id).emit('open_page',g[data],g.hands,g.used_cards,g.trump,v,'В светлую')
					}
					else{io.to(socket.id).emit('open_page',g[data],g.hands,g.used_cards,g.trump)}
				}
			}
			else if (g.trump.stat==='fin'){io.to(socket.id).emit('open_page',g[data],g.hands,g.used_cards,g.trump)}
		}
		else{io.to(socket.id).emit('join',[Array.from(pp.values()),'Закончить игру'])}	
	})
		
	socket.on ('check_in', function(data,ev_nm){
		if (ev_nm==='Запомнить мое имя'&&users.has(data)===false){
			find_user({[data]:{$exists:true}},{projection:{_id:0,[data]:1}}).then((resp)=>{
				if(resp){io.to(socket.id).emit('check_in', ev_nm, 'enter_pass')}
				else{let p=Math.random().toString(36).slice(-5),p_inf=pass_inf1+p+pass_inf2;
					insrt_user({[data]:['socket.id',p],'res':results}).then(()=>{io.to(socket.id).emit('check_in',ev_nm,p_inf,p)
					}).catch(err=>{catch_err(err)})
				}
			}).catch(err=>{catch_err(err)})
		}
		else if (ev_nm==='Запомнить мое имя'&&users.has(data)===true){io.to(socket.id).emit('check_in', ev_nm, 'enter_pass')}		
		else if (ev_nm==='Посмотреть пароль'){let p_inf=pass_inf1+data+pass_inf2; io.to(socket.id).emit('check_in',ev_nm,p_inf)}
		else if (ev_nm==='Сменить свое имя'&&users.has(data[0])===true){io.to(socket.id).emit('check_in', ev_nm, 'enter_pass')}
		else if (ev_nm==='Сменить свое имя'&&users.has(data[0])===false){
			find_user({[data[0]]:{$exists:true}},{projection:{_id:0,[data[0]]:1}}).then((resp)=>{visitors.delete(data[1])			
				if(resp){io.to(socket.id).emit('check_in',ev_nm,'enter_pass')}
				else{visitors.set(data[0],[socket.id,0])					
					upd_user([data[1]],{$rename:{[data[1]]:data[0]}}).then(()=>{io.to(socket.id).emit('check_in',ev_nm,'change_name',data[0])
					}).catch(err=>{catch_err(err)})
				}
			}).catch(err=>{catch_err(err)})
		}
		else if (ev_nm==='Запомнить новый пароль'){			
			upd_user([data[0]],{$set:{[data[0]]:['socket.id',data[1]]}}).then(()=>{io.to(socket.id).emit('check_in',ev_nm,data)
			}).catch(err=>{catch_err(err)})
		}		
		else if (ev_nm==='Ввести пароль'){
			if(users.has(data[0])===true){io.to(socket.id).emit('check_in',ev_nm,'в игре',data[1])}
			else{
				find_user({[data[0]]:{$exists:true}},{projection:{_id:0,[data[0]]:1}}).then((resp)=>{				
					if(resp[data[0]][1]!==data[1]){io.to(socket.id).emit('check_in','Пароль не верный')}
					else{visitors.set(data[0],[socket.id,0]);let p_inf=pass_inf1+data[1]+pass_inf2;io.to(socket.id).emit('check_in',ev_nm,p_inf,data[1])}
				}).catch(err=>{catch_err(err)})
			}
		}
	})
	
	socket.on ('join', function(data){
		if (data[1]==='Создать игру'){let in_game=users.get(data[0])
			if(!in_game||in_game.length==2){
				if(pp.has(data[0])===false){
					find_user({[data[0]]:{$exists:true}},{projection:{_id:0,[data[0]]:1}}).then((resp)=>{
						if(!resp){not_responce(data,socket.id).then((pass)=>{create_game(data,socket.id,pass)})}
						else{create_game(data,socket.id,resp[data[0]][1])}
					}).catch(err=>{catch_err(err)})
				}
			}
			else{io.to(socket.id).emit('join',[data[0],'in_game',in_g])}
		}
		else if (data[1].slice(0,14)==='Присоединиться'){let in_game=users.get(data[0]);
			if(!in_game||in_game.length==2){let pl=pp.get(data[0]),sec_pl;
				if(pl){
					if(pl.length===3){sec_pl=pl[2];users.delete(pl[2])};pp.delete(data[0]);io.emit('join',[data[0],'Отменить создание',sec_pl]);
				}
				else{for(let [k,v] of pp){if(v[2]&&v[2]===data[0]){v.pop();io.emit('join',[v[1],'Выйти',data[0]]);break}}}
				let u=pp.get(data[2].slice(3))
				find_user({[data[0]]:{$exists:true}},{projection:{_id:0,[data[0]]:1}}).then((resp)=>{
					if(!resp){not_responce(data,socket.id).then((pass)=>{join_game(data,u,socket.id,pass)})}
					else{join_game(data,u,socket.id,resp[data[0]][1])}
				}).catch(err=>{catch_err(err)})
			}
			else{io.to(socket.id).emit('join',[data[2],'in_game',in_g])}
		}
		else if (data[1]==='Отменить создание'){
			let pl=pp.get(data[0]),sec_pl;if(pl.length===3){sec_pl=pl[2];users.delete(pl[2])};
			users.delete(pl[1]);pp.delete(data[0]);io.emit('join',[...data,sec_pl])
		}
		else if (data[1]==='Выйти'){let pl=pp.get(data[2]),u=users.get(data[0])
			if(pl&&pl.length==3&&pl[2]===data[0]){pl.pop();users.delete(data[0]);io.emit('join',[pl[1],data[1],data[0]])}
			else if(u&&u.length==3){io.to(socket.id).emit('join',[data[0],'in_game',in_g])}
			else{io.to(socket.id).emit('join',[Array.from(pp.values()),'Закончить игру'])}
		}
		else if (data[1]==='Закончить игру'){let u=users.get(data[0])
			if(u){
				let n_g=u[2],s='bot_'+n_g.slice(-1)+data[0],g=games.get(n_g),t_d=temp_data.get(n_g);
				if(g.trump.stat==='drop'||g.trump.stat==='order'||g.trump.stat==='wist'||g.trump.stat==='l_d'){
					upd_user([data[0]],{$inc:{'res.buy_in_esc':1}}).catch(err=>{catch_err(err)})
				}
				let re=new RegExp(data[0],'g'),new_g=JSON.stringify(g).replace(re,s)
				users.set(s,u);users.delete(data[0]);for (let k in t_d){t_d[k]=t_d[k].map(i=>i===data[0]?i=s:i=i)}
				games.set(n_g,JSON.parse(new_g));g=games.get(n_g);g.bot[0].push(data[0]);g.bot[1].push(s)
				for (let k in games.get(n_g).hands){let p=users.get(k)
					if(p&&k!==s){io.to(p[0]).emit('join',[data[0],'bot',s])}else if(p&&k===s){io.to(p[0]).emit('join',['reload','bot'])}
				}
				if(g.bot[0].length==3&&g.trump.stat==='fin'){
					setTimeout(()=>{games.delete(n_g);temp_data.delete(n_g);delete timerId[n_g];
					g.bot[1].forEach(i=>{users.delete(i)})},g.pause*1000)
				}
				if(g.trump.stat!=='fin'){upd_user([data[0]],{$inc:{'res.pul.escape':1}}).catch(err=>{catch_err(err)})}
			}
			else{io.to(socket.id).emit('join',['reload','bot'])}
			let v=visitors.get(data[0]);if(v){v[1]=0}
		}
		else if (data[1]==='подключился'){let g=users.get(data[0]);
			if(g){g[0]=socket.id;let n_g=games.get(g[2])
				if(n_g){
					for (let k in n_g){
						if([data[0],'deck','hands','trump','used_cards','pulya','pause','bot'].includes(k)===false){
							let s=users.get(k);if(s){io.to(s[0]).emit('join',data)}}}
					visitors.set(data[0],[socket.id,1])
				}
				else{visitors.set(data[0],[socket.id,0])}
			}
			else{visitors.set(data[0],[socket.id,0])};
			io.emit('join',[visitors.size,'онлайн']);
		}
		else if (data[1]==='кто онлайн'){io.to(socket.id).emit('join',[data[0],data[1],Object.fromEntries(visitors)])}
		else if (data[1]==='Статистика'){
			find_user({[data[0]]:{$exists:true}},{projection:{_id:0,res:1}}).then((resp)=>{
				if(resp){io.to(socket.id).emit('join',[resp.res,data[1]])}
			}).catch(err=>{catch_err(err)})
		}
		else if (data[1]==='help'){
			let pl=users.get(data[0]),g;if(pl){g=games.get(pl[2])}
			if (g){
				if (g.trump.stat=='trade'){io.to(socket.id).emit('join',[h4,data[1]])}
				else if (g.trump.stat=='drop'){
					g.trump[g.hands[data[0]]][0]==='pas'?io.to(socket.id).emit('join',[h5_5,data[1]]):io.to(socket.id).emit('join',[h5,data[1]])
				}
				else if (g.trump.stat=='order'){
					g.trump[g.hands[data[0]]][0]==='pas'?io.to(socket.id).emit('join',[h6_6,data[1]]):io.to(socket.id).emit('join',[h6,data[1]])
				}
				else if (g.trump.stat=='wist'){
					g.trump[g.trump.n_hand[0].slice(6)][3]===data[0]?io.to(socket.id).emit('join',[h7,data[1]]):io.to(socket.id).emit('join',[h7_7,data[1]])
				}
				else if (g.trump.stat=='l_d'){
					g.trump[g.trump.n_hand[0].slice(6)][3]===data[0]?io.to(socket.id).emit('join',[h8,data[1]]):io.to(socket.id).emit('join',[h8_8,data[1]])
				}
				else if (g.trump.stat=='playing'){
					if(g.trump.n_hand[1]==='распасовка'){io.to(socket.id).emit('join',[h9,data[1]])}
					else if(g.trump.n_hand[1]==='Мизер'){io.to(socket.id).emit('join',[h10,data[1]])}
					else{io.to(socket.id).emit('join',[h11[parseInt(g.trump[g.trump.n_hand[2]][1],10)],data[1]])
					}
				}
			}
			else{
				if(data[2]){io.to(socket.id).emit('join',[h3,data[1]])}
				else if(pp.size!=0){
					if(Object.values(Object.fromEntries(pp.entries())).flat().includes(data[0])===true){io.to(socket.id).emit('join',[h2_2,data[1]])}
					else{io.to(socket.id).emit('join',[h2,data[1]])}
				}
				else{io.to(socket.id).emit('join',[h1,data[1]])}
			}
		}
	})
	
	socket.on ('trade', function(elem){let n_g=users.get(elem[3])[2],g=games.get(n_g)
		clearInterval(timerId[n_g]);func_trade(elem,g,io).then(()=>{turn_timer(g,g.pause,n_g)})
	})
	
	socket.on ('assign_game', function(data){
		let n_g=users.get(data[1])[2],g=games.get(n_g);clearInterval(timerId[n_g]);
		if (data[0]==='stop'){io.to(socket.id).emit('assign_game', ['take_ransom', g[data[1]]]);
			data.push(g.deck); search_players_by_name (data[1], data, 'assign_game')
			turn_timer(g,g.pause,n_g)
		}
		if (data[0]==='discard'){let start_deck=g[data[1]].slice()
			for (let i = 0; i < 2; i++){g[data[1]].splice(g[data[1]].indexOf(g[data[1]].find(el=>el[3]===data[2][i][0])),1)}
			io.to(socket.id).emit('assign_game', ['order',start_deck,g[data[1]]])
			search_players_by_name (data[1],['сбросил',data[1]],'assign_game');	g.trump.stat='order'
			let suits=[g[data[1]].filter(i=>i[0]==='1Spades'),g[data[1]].filter(i=>i[0]==='2Clubs'),g[data[1]].filter(i=>i[0]==='3Diamonds'),g[data[1]].filter(i=>i[0]==='4Hearts')];
			auto_order(suits,g,data[1])
			turn_timer(g,g.pause,n_g)
		}
	})
	
	socket.on ('order', function(data){let n_g=users.get(data[3])[2],g=games.get(n_g);clearInterval(timerId[n_g]);
		assign_order(data,g,io).then(()=>{games.get(n_g)?turn_timer(g,g.pause,n_g):delete timerId[n_g]})
	})
	
	socket.on ('playing', function(data){
		let n_g,g,n=users.get(data[2]);if(n){n_g=n[2]};if(n_g){g = games.get(n_g)}
		if(g){
			if (data[0]==='В светлую'||data[0]==='В темную'){clearInterval(timerId[n_g]);auto_ld(g,data).then(()=>{turn_timer(g,g.pause,n_g)})}
			else if (data[0]==='run'){
				clearInterval(timerId[n_g]);run(data,g,io).then(()=>{
					g[g.trump[g.trump.n_hand[0].substring(6)][3]].length>0?turn_timer(g,g.pause,n_g):count_pulya(data,g,io).then(()=>{
						if(temp_data.get(n_g)){turn_timer(g,g.pause,n_g)}else{delete timerId[n_g]}
					})
				})
			}
			else if (data[0]==='pulya'){io.to(socket.id).emit('playing',['pulya', g.pulya])}
		}
	})
	
	socket.on('chat',(msg)=>{
		if(msg[2].chat_mess_game==='flex'){let p=users.get(msg[0])
		if(p){let g=games.get(p[2]);if(g){for(let k in g.hands){io.to(users.get(k)[0]).emit('chat',msg)}}}}
		else if(msg[2].chat_mess_glob==='flex'){io.emit('chat',msg)}
	})	
})

const turn_timer=(g,sec,n_t)=>{let t_d=temp_data.get(n_t);
	if(t_d){
		if(t_d.playing.length!=0){
			if(g.bot[1].includes(t_d.playing[2])===true&&g.trump[t_d.playing[1]][0]!=='В светлую'){sec=2}
			else if(g.bot[1].includes(t_d.playing[2])===true&&(g.trump.n_hand[1]==='Мизер'||g.trump.n_hand[3]==10)){sec=2}
			else if(g.trump[t_d.playing[1]][0]==='В светлую'){
				for (let h in g.trump){
					if(g.trump[h][1]==='Вист'&&g.bot[1].includes(g.trump[h][3])===true&&(g.trump[t_d.playing[1]][1]==='Вист'||g.trump[t_d.playing[1]][1]==='Пас')){sec=2}
					else if(g.trump[h][1]!=='Вист'&&g.trump[h][1]!=='Пас'&&g.bot[1].includes(g.trump[h][3])===true&&g.trump[h][3]===t_d.playing[2]){sec=2}
				}
			}
		}
		else if(t_d.order.length!=0){if(g.bot[1].includes(t_d.order[3])===true){sec=2}}
		else if(t_d.trade.length!=0){if(g.bot[1].includes(t_d.trade[3])===true){sec=2}}
	}	
	if(g.trump.stat!=='fin'){
		timerId[n_t]=setInterval(()=>{
			if(sec<=0){clearInterval(timerId[n_t]);g=games.get(n_t)
				if(g){
					if(g.trump.stat==='trade'){
						let update_data=temp_data.get(n_t).trade;func_trade(update_data,g,io).then(()=>{turn_timer(g,g.pause,n_t)})
					} 
					else if(g.trump.stat==='drop'){
						let start_deck=g[temp_data.get(n_t).trade[3]];auto_drop(start_deck,g,temp_data.get(n_t).trade[3]).then(()=>{turn_timer(g,g.pause,n_t)})
					}
					else if(g.trump.stat==='order'||g.trump.stat==='wist'){
						if(temp_data.get(n_t)){assign_order(temp_data.get(n_t).order,g,io).then(()=>{turn_timer(g,g.pause,n_t)})}
						else{delete timerId[n_t]}
					}
					else if(g.trump.stat==='l_d'){
						let update_data=temp_data.get(n_t).order;auto_ld(g,update_data).then(()=>{turn_timer(g,g.pause,n_t)})
					}
					else if(g.trump.stat==='playing'){let update_data=temp_data.get(n_t).playing;
						g[update_data[2]].length>0?run(update_data,g,io).then(()=>{turn_timer(g,g.pause,n_t)}):count_pulya(update_data,g,io).then(()=>{
							if(temp_data.get(n_t)){turn_timer(g,g.pause,n_t)}else{delete timerId[n_t]}
						})
					}
				}
			}
			else{console.log(sec,Object.keys(g.hands))};sec--
		}, 1000)
	}
}

async function not_responce(data,sock){
	let p=Math.random().toString(36).slice(-5),p_inf=pass_inf3+p+pass_inf4;insrt_user({[data[0]]:['socket.id',p],'res':results}).then(()=>{
	visitors.set(data[0],[p,0]);io.to(sock).emit('check_in','Запомнить мое имя',p_inf,p)}).catch(err=>{catch_err(err)});return p
}

export function catch_err(err){console.log(195,err.message);if(err.message.includes('must be connected')===true){con_mongo()}}

export function set_game(g){
	const deck = [
		['3Diamonds',7,'7_diamonds'],['3Diamonds',8,'8_diamonds'],['3Diamonds',9,'9_diamonds'],['3Diamonds',10,'10_diamonds'],
		['3Diamonds',11,'J_diamonds'],['3Diamonds',12,'Q_diamonds'],['3Diamonds',13,'K_diamonds'],['3Diamonds',14,'A_diamonds'],
		['4Hearts',7,'7_Hearts'],['4Hearts',8,'8_Hearts'],['4Hearts',9,'9_Hearts'],['4Hearts',10,'10_Hearts'],
		['4Hearts',11,'J_Hearts'],['4Hearts',12,'Q_Hearts'],['4Hearts',13,'K_Hearts'],['4Hearts',14,'A_Hearts'],
		['1Spades',7,'7_Spades'],['1Spades',8,'8_Spades'],['1Spades',9,'9_Spades'],['1Spades',10,'10_Spades'],
		['1Spades',11,'J_Spades'],['1Spades',12,'Q_Spades'],['1Spades',13,'K_Spades'],['1Spades',14,'A_Spades'],
		['2Clubs',7,'7_Clubs'],['2Clubs',8,'8_Clubs'],['2Clubs',9,'9_Clubs'],['2Clubs',10,'10_Clubs'],
		['2Clubs',11,'J_Clubs'],['2Clubs',12,'Q_Clubs'],['2Clubs',13,'K_Clubs'],['2Clubs',14,'A_Clubs']
	]
	let pref_deck = deck.slice(); shuffle(pref_deck); shuffle(card_id);pref_deck.forEach((item,i)=>{if (item.length!==3){item.pop()};
	item.push(card_id[i])});for (let i in g.hands){g[i]=sorting(pref_deck.splice(0,10))};
	g.deck=pref_deck;g.trump={'1-я рука':'','2-я рука':'','3-я рука':'','n_hand':[],'stat':'trade'};	
	
}

function shuffle(array){for (let i=array.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[array[i],array[j]]=[array[j],array[i]]}}

export function sorting(massiv){
	function compare(a, b){return a[1] - b[1]}
	massiv.sort()
	let result1 = massiv.filter(a => a[0] === '1Spades').sort(compare), result2 = massiv.filter(a => a[0] === '2Clubs').sort(compare),
	result3 = massiv.filter(a => a[0] === '3Diamonds').sort(compare), result4 = massiv.filter(a => a[0] === '4Hearts').sort(compare);
	massiv=result1.concat(result2, result3, result4); 
	return massiv
}

async function search_user_in_game (soc_id,ev,soc_name) {
	for (let [k_u, v_u] of users){if (v_u[0]===soc_id){
		for(let [key_games,v_g] of games){if(k_u in v_g){for(let k_v_g in v_g.hands){if(k_v_g!==k_u){io.to(users.get(k_v_g)[0]).emit(soc_name,[ev,k_u])}}break}
		}break}
	}
}

export async function search_players_by_name (name,ev,soc_name){let g=games.get(users.get(name)[2]);
	for (let h in g.hands){io.to(users.get(h)[0]).emit(soc_name, ev, name)}
}

function create_game(data,sock,pasw){
	pp.set(data[0],[[data[2],data[3]],data[0]]);let i=`pl_${data[0]}`,v=`  Пуля до ${data[2]}, ждем ход - ${data[3]}сек: <b onclick="statistic(this)">${data[0]}</b>`,str=join_str(i,v);
	io.emit('join',[str,data[1],data[0]]);users.set(data[0],[sock,pasw])
}

function join_game(data,u,sock,pasw){
	if(u.length===2){u[2]=data[0];io.emit('join',[data[2],'Присоединиться',`${data[3]} + <b onclick="statistic(this)">${data[0]}</b>`,data[0]]);users.set(data[0],[sock,pasw])}
	else if(u.length===3){
		let u0=u[1],u1=u[2],u2=data[0];users.set(data[0],[sock,pasw])
		let cards_dealt={[u0]:[],[u1]:[],[u2]:[],'deck':[],'hands':{[u0]:'1-я рука',[u1]:'2-я рука',[u2]:'3-я рука'},'trump':{},'used_cards':[],
		'pulya':{[u0]:{'gora':'','pul':'',[u1]:'',[u2]:''},[u1]:{'gora':'','pul':'',[u0]:'',[u2]:''},[u2]:{'gora':'','pul':'',[u0]:'',[u1]:''},'finish':u[0][0]},'pause':Number(u[0][1]),'bot':[[],[]]}, game_name='game_'+count_game;
		set_game(cards_dealt);games.set(game_name,cards_dealt);count_game++;timerId[game_name]='';
		let update_data={'trade':['pas','Пас',26,u0,'1-я рука'],'order':[],'playing':[]}
		temp_data.set(game_name,update_data);io.emit('join',[u0,'Отменить создание',[u0,u1,u2]]);pp.delete(u0);
		[u0,u1,u2].forEach(i=>{
			users.get(i)[2]=game_name;io.to(users.get(i)[0]).emit('join',[trade,'Старт',cards_dealt.hands,cards_dealt[i]]);
			let v=visitors.get(i);if(v){v[1]=1};upd_user(i,{$inc:{'res.pul.all':1}}).catch(err=>{catch_err(err)})
		})
		turn_timer(cards_dealt,cards_dealt.pause,game_name);
	} 
	else{io.to(sock).emit('join','Такой игры больше нет')}	
}

async function auto_drop(start_deck,g,n_g){
	let first_deck=start_deck.slice(),soc=users.get(n_g)[0],suits=[start_deck.filter(i=>i[0]==='1Spades'),start_deck.filter(i=>i[0]==='2Clubs'),start_deck.filter(i=>i[0]==='3Diamonds'),start_deck.filter(i=>i[0]==='4Hearts')];
	function sort_suit(a, b){return a.length - b.length}; suits.sort(sort_suit);	
	for(let el in suits){
		if(suits[el].length===1&&suits[el][0][1]!=14){start_deck.splice(start_deck.indexOf(suits[el][0]),1)}
		else if(suits[el].length===2&&(suits[el][1][1]==14&&suits[el][0][1]!=13)){start_deck.splice(start_deck.indexOf(suits[el][0]),1)}
		else if(suits[el].length===2&&((suits[el][1][1]==13&&suits[el][0][1]!=12)||(suits[el][1][1]!=14&&(suits[el][1][1]!=13&&suits[el][0][1]!=12)))){
			if(start_deck.length==12){start_deck.splice(start_deck.indexOf(suits[el][0]),1);start_deck.splice(start_deck.indexOf(suits[el][1]),1);break}
			else if(start_deck.length==11){start_deck.splice(start_deck.indexOf(suits[el][0]),1);break}
		}
		else if(suits[el].length===3){
			if((suits[el][2][1]==14&&suits[el][1][1]==13&&suits[el][0][1]!=12)||(suits[el][2][1]==13&&suits[el][1][1]==12&&suits[el][0][1]!=11)){
				start_deck.splice(start_deck.indexOf(suits[el][0]),1)}
			else if((suits[el][2][1]==14&&suits[el][1][1]==12&&suits[el][0][1]!=11)||(suits[el][2][1]==13&&suits[el][1][1]==11&&suits[el][0][1]!=10)){
				if(start_deck.length==12){start_deck.splice(start_deck.indexOf(suits[el][0]),1);start_deck.splice(start_deck.indexOf(suits[el][1]),1);break}
				else if(start_deck.length==11){start_deck.splice(start_deck.indexOf(suits[el][0]),1);break}
			}
			else if((suits[el][2][1]==14&&suits[el][1][1]!=13&&suits[el][0][1]!=12)||(suits[el][2][1]==13&&suits[el][1][1]!=12&&suits[el][0][1]!=11)){
				if(start_deck.length==12){start_deck.splice(start_deck.indexOf(suits[el][0]),1);start_deck.splice(start_deck.indexOf(suits[el][1]),1);break}
				else if(start_deck.length==11){start_deck.splice(start_deck.indexOf(suits[el][0]),1);break}
			}
		}
		else if(suits[el].length===4){
			if(start_deck.length==12){start_deck.splice(start_deck.indexOf(suits[el][0]),1);start_deck.splice(start_deck.indexOf(suits[el][1]),1);break}
			else if(start_deck.length==11){start_deck.splice(start_deck.indexOf(suits[el][0]),1);break}
		}
		if(start_deck.length==10){break}
	}
	io.to(soc).emit('assign_game',['order',first_deck,start_deck]);search_players_by_name (n_g,['сбросил',n_g],'assign_game');g.trump.stat='order'	
	auto_order(suits,g,n_g)
}

async function auto_order(suits,g,n_g){
	let long_suit=suits.filter(i=>i.map(j=>j=j[1]).reduce((a,b)=>Number(a)+Number(b),'')==(suits.filter(i=>i.length===Math.max(...suits.map(i=>i=i.length))).map(i=>i.map(j=>j=j[1])).map(i=>i.reduce((a,b)=>Number(a)+Number(b),'')).reduce((a,b)=>Number(a)>Number(b)?a:b,''))),
	update_data=temp_data.get(users.get(n_g)[2]).order;
	const upd_0=(h,n)=>{update_data[0]=h+'_'+long_suit[0][0][0].slice(1,2);update_data[1]=h+n}
	const upd_1=(h,n)=>{update_data[0]=(h+1)+'_'+long_suit[0][0][0].slice(1,2);update_data[1]=(h+1)+n}
	if(long_suit[0][0][0].slice(1,2)===g.trump[g.hands[n_g]][0].slice(-1)||g.trump[g.hands[n_g]][0].slice(0,2)==10||g.trump[g.hands[n_g]][0]==='miser'){
		update_data[0]=g.trump[g.hands[n_g]][0];update_data[1]=g.trump[g.hands[n_g]][1]}	
	else{let m={S:'♠',C:'♣',D:'♦',H:'♥'},h=Number(g.trump[g.hands[n_g]][0].slice(0,1)),n
		for(let i in m){if(long_suit[0][0][0].slice(1,2)===i){n=m[i];break}}
		if(g.trump[g.hands[n_g]][0].slice(-1)==='S'){upd_0(h,n)}
		else if(g.trump[g.hands[n_g]][0].slice(-1)==='C'){long_suit[0][0][0].slice(1,2)==='S'?upd_1(h,n):upd_0(h,n)}
		else if(g.trump[g.hands[n_g]][0].slice(-1)==='D'){long_suit[0][0][0].slice(1,2)==='H'?upd_0(h,n):upd_1(h,n)}
		else if(g.trump[g.hands[n_g]][0].slice(-1)==='H'||g.trump[g.hands[n_g]][0].slice(-2)==='BK'){upd_1(h,n)}			
	}
	update_data[2]=g.hands[n_g];update_data[3]=n_g;	update_data[4]='';update_data[5]='Заказывает игру'
}

async function auto_ld(g,data){
	g.trump.stat='playing';g.trump.n_hand[0]='Ждем: 1-я рука';g.trump['1-я рука'][0]=data[0];g.trump['2-я рука'][0]=data[0];g.trump['3-я рука'][0]=data[0]	
	let gm=parseInt(g.trump[g.trump.n_hand[2]][1],10),vl;
	for(let i in g.hands){
		if(g.trump[g.hands[i]][1]==='Вист'){vl=`res.${gm}w.all`}
		else if(g.hands[i]===g.trump.n_hand[2]){vl=`res.${gm}g.all`}
		else{vl=`res.pas`};
		upd_user(i,{$inc:{[vl]:1}}).catch(err=>{catch_err(err)})
	}
	if (data[0]==='В светлую'){let v={}
		for (let h in g.trump){if(g.trump[h][1]==='Вист'||g.trump[h][1]==='Пас'){v[h]=[h,g.trump[h][1],g.trump[h][3],g[g.trump[h][3]]]}}
		search_players_by_name(data[2],['игра',data,g.trump,[data[1]],v],'playing')
	}
	else if (data[0]==='В темную'){search_players_by_name(data[2],['игра',data,g.trump,[data[1]]],'playing')}
	let n_p=g.trump['1-я рука'][3],upd_d_p=temp_data.get(users.get(n_p)[2]).playing
	upd_d_p[0]='run';upd_d_p[1]='1-я рука';upd_d_p[2]=n_p;upd_d_p[3]=g[n_p].find(i=>i[1]===Math.max.apply(null,g[n_p].map(i=>i[1])))[3]
}

async function find_user(a,b){return dbase.findOne(a,b)}
async function insrt_user(user){dbase.insertOne(user)}
export async function upd_user(user,upd_data){dbase.updateOne({[user]:{$exists:true}},upd_data)}

http.listen(PORT, () => {console.log('listening on *:80')})