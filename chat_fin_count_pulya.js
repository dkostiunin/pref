import {search_players_by_name,set_game,users,games,pp,temp_data,timerId,upd_user,catch_err,con_mongo,client,dbase} from './chat.js'
import {trade} from './constants.js'
export default async function count_pulya(data,g,io){let f_p=Number(g.pulya.finish);
	if (g.trump.n_hand[1]!=='распасовка'&&g.trump.n_hand[1]!=='Мизер'){
		let vl,v,z=parseInt(g.trump[g.trump.n_hand[2]][1],10),// z=Number(g.trump[g.trump.n_hand[2]][1].slice(0,-1)),v-ответственный вистер, z-заказанная игра
		w=[g.trump['1-я рука'][1],g.trump['2-я рука'][1],g.trump['3-я рука'][1]], // массив заказанных игр
		t=g.trump.n_hand[2],x=g.trump[t][3],cost=10-(10-z)*2; //t-разыгрывающий игрок-рука,x-разыгрывающий игрок имя, cost-цена взятки/цена игры
		if (t==='1-я рука'){v=g.trump['3-я рука'][3]}else if(t==='2-я рука'){v=g.trump['1-я рука'][3]}else{v=g.trump['2-я рука'][3]}
		for (let h in g.trump){if (h==='n_hand'||h==='stat'){continue};
			if (h===t){
				let n=val_from_pulya(g.pulya[g.trump[h][3]].gora),p=val_from_pulya(g.pulya[g.trump[h][3]].pul);
				if(g.trump[h][4]<z){g.pulya[g.trump[h][3]].gora=g.pulya[g.trump[h][3]].gora+String(n+((z-g.trump[h][4])*cost))+'.'}
				else{set_pul(g,h,p,cost,f_p,x,n);vl=`res.${z}g.win`;upd_user(x,{$inc:{[vl]:1}}).catch(err=>{catch_err(err)})}
			}
			else if (g.trump[h][1]==='Вист'){
				let f=g.pulya[g.trump[h][3]][x],n=val_from_pulya(f),k=g.trump[h][4]*cost,gr=g.pulya[g.trump[h][3]].gora,p=val_from_pulya(gr)
				if(g.trump[t][4]>z){
					if(w.includes('Пас')===false){
						if(k!==0){g.pulya[g.trump[h][3]][x]=f+String(n+k)+'.'};
						if(z===6){
							if (g.trump[h][4]===0){
								g.trump[t][4]===7?g.pulya[g.trump[h][3]].gora=gr+String(p+cost)+'.':g.pulya[g.trump[h][3]].gora=gr+String(p+2*cost)+'.'
							}
							else if (g.trump[h][4]===1){
								g.pulya[g.trump[h][3]].gora=gr+String(p+cost)+'.'
							}
						}
						else if ((z===7&&g.trump[h][4]===0&&g.trump[t][4]>8)||((z===8||z===9)&&g.trump[t][4]===10&&g.trump[h][3]===v)){
							g.pulya[g.trump[h][3]].gora=gr+String(p+cost)+'.'
						}
					}
					else if(w.includes('Пас')===true){
						g.pulya[g.trump[h][3]][x]=f+String(n+(10-g.trump[t][4])*cost)+'.'
						if(z===6||z===9){g.pulya[g.trump[h][3]].gora=gr+String(p+(g.trump[t][4]-z)*cost)+'.'}
						else if((z===7||z===8)&&g.trump[t][4]-1>z){g.pulya[g.trump[h][3]].gora=gr+String(p+(g.trump[t][4]-z-1)*cost)+'.'}
					}
				}
				else{
					if(g.trump[t][4]<z){vl=`res.${z}w.win`;upd_user(g.trump[h][3],{$inc:{[vl]:1}}).catch(err=>{catch_err(err)})}
					if(w.includes('Пас')===false){
						if(k+(z-g.trump[t][4])*cost!==0){g.pulya[g.trump[h][3]][x]=f+String(n+k+(z-g.trump[t][4])*cost)+'.'}
					}
					else if(w.includes('Пас')===true){
						g.pulya[g.trump[h][3]][x]=f+String(n+(10-g.trump[t][4])*cost+(z-g.trump[t][4])*cost)+'.'
					}
				}
			}
			else if (g.trump[h][1]==='Пас'&&g.trump[t][4]<z){
				g.pulya[g.trump[h][3]][x]=g.pulya[g.trump[h][3]][x]+String(val_from_pulya(g.pulya[g.trump[h][3]][x])+(z-g.trump[t][4])*cost)+'.'
				if(z==10){upd_user(g.trump[h][3],{$inc:{'res.10p.win':1}}).catch(err=>{catch_err(err)})}
			}
			else if (g.trump[h][1]==='Пол виста'){
			g.pulya[g.trump[h][3]][x]=g.pulya[g.trump[h][3]][x]+String(val_from_pulya(g.pulya[g.trump[h][3]][x])+4)+'.'}
		}
	}
	else if (g.trump.n_hand[1]==='распасовка'){let v=[]
		for (let h in g.trump){if (h==='n_hand'||h==='stat'){continue};v.push(g.trump[h][4])};v=Math.min(...v)
		for (let h in g.trump){if (h==='n_hand'||h==='stat'){continue};				
			let n=val_from_pulya(g.pulya[g.trump[h][3]].gora),p=val_from_pulya(g.pulya[g.trump[h][3]].pul),f=Number(g.trump[h][4])-v
			if(f==0){upd_user(g.trump[h][3],{$inc:{'res.raspas.win':1}}).catch(err=>{catch_err(err)})}
			if(f!=0){g.pulya[g.trump[h][3]].gora=g.pulya[g.trump[h][3]].gora+String(n+f)+'.'}
			else if(Number(g.trump[h][4])==0){
				if(p+1<=f_p){g.pulya[g.trump[h][3]].pul=g.pulya[g.trump[h][3]].pul+String(p+1)+'.'}
				else{let v_p=[]
					for (let pl in g.pulya){if (pl==='finish'||pl===g.trump[h][3]){continue};
					v_p.push([pl,Number(val_from_pulya(g.pulya[pl].pul)),g.pulya[g.trump[h][3]][pl]])}
					if(v_p[0][1]+1<=f_p&&v_p[1][1]+1>=f_p){
						g.pulya[v_p[0][0]].pul=g.pulya[v_p[0][0]].pul+String(v_p[0][1]+1)+'.';
						g.pulya[g.trump[h][3]][v_p[0][0]]=v_p[0][2]+String(val_from_pulya(v_p[0][2])+10)+'.'
					}
					else if(v_p[1][1]+1<=f_p&&v_p[0][1]+1>=f_p){
						g.pulya[v_p[1][0]].pul=g.pulya[v_p[1][0]].pul+String(v_p[1][1]+1)+'.';
						g.pulya[g.trump[h][3]][v_p[1][0]]=v_p[0][2]+String(val_from_pulya(v_p[1][2])+10)+'.'
					}
					else if(v_p[0][1]+1<=f_p&&v_p[1][1]+1<=f_p){let pp=v_p[0][1]>=v_p[1][1]?v_p[0]:v_p[1]
						g.pulya[pp[0]].pul=g.pulya[pp[0]].pul+String(pp[1]+1)+'.';
						g.pulya[g.trump[h][3]][pp[0]]=pp[2]+String(val_from_pulya(pp[2])+10)+'.'
					}
					else if(v_p[0][1]+1>f_p&&v_p[1][1]+1>f_p){g.pulya[g.trump[h][3]].gora=g.pulya[g.trump[h][3]].gora+String(n-1)+'.'}
				}
			}
		}
	}
	else if (g.trump.n_hand[1]==='Мизер'){
		let t=g.trump.n_hand[2],x=g.trump[t][3],n=val_from_pulya(g.pulya[x].gora),p=val_from_pulya(g.pulya[x].pul),f=Number(g.trump[t][4])
		if(f>0){
			g.pulya[x].gora=g.pulya[x].gora+String(n+10*f)+'.'
			for(let i in g.hands){if(i!==x){upd_user(i,{$inc:{'res.miserp.win':1}}).catch(err=>{catch_err(err)})}}
		}
		else{set_pul(g,t,p,10,f_p,x,n);upd_user(x,{$inc:{'res.miserg.win':1}}).catch(err=>{catch_err(err)})}
	}	
	let fin=[]; for(let i in g.pulya){if(Number(val_from_pulya(g.pulya[i].pul))!==f_p){fin.push(i)}}
	if(g.bot[0].length<3){
		if (fin.length>1){let temp=temp_data.get(users.get(data[2])[2]),update_trade_data=temp.trade;temp.order=[];temp.playing=[];set_game(g)
			update_trade_data[0]='pas';update_trade_data[1]='Пас';update_trade_data[2]=26;update_trade_data[4]='1-я рука';
			for(let i in g.hands){if(g.hands[i]==='1-я рука'){g.hands[i]='3-я рука'}
				else if(g.hands[i]==='2-я рука'){g.hands[i]='1-я рука';update_trade_data[3]=i}	
				else if(g.hands[i]==='3-я рука'){g.hands[i]='2-я рука'}
			}
			setTimeout(()=>{search_players_by_name(data[2],['pulya', g.pulya],'playing')
			for(let i in g.hands){io.to(users.get(i)[0]).emit('join',[trade,'Старт',g.hands, g[i]])}},2000)
		}
		else{set_res(g.pulya,g.bot,'f')
			search_players_by_name(data[2],['pulya', g.pulya],'playing');g.trump.stat='fin';let n_g=users.get(data[2])[2];temp_data.delete(n_g)
		}
	}
	else{set_res(g.pulya,g.bot);
		let n_g=users.get(data[2])[2];temp_data.delete(n_g);for(let k in g.hands){users.delete(k)};games.delete(n_g);delete timerId[n_g]}
}

function set_res(g,b,f){let p=[],d=[]
	for(let i in g){if(i!=='finish'){b[1].includes(i)===true?p.push([b[0][b[1].indexOf(i)]]):p.push([i]);d.push([i])
		p[p.length-1].push(Number(g[i].gora.split('.').slice(-2,-1))-Number(g[i].pul.split('.').slice(-2,-1)))}
		}
	p[0].push((p[1][1]-p[0][1])/3*10);p[0].push((p[2][1]-p[0][1])/3*10);
	p[1].push((p[0][1]-p[1][1])/3*10);p[1].push((p[2][1]-p[1][1])/3*10);
	p[2].push((p[0][1]-p[2][1])/3*10);p[2].push((p[1][1]-p[2][1])/3*10);
	p[0].push(Number(g[d[0][0]][d[1][0]].split('.').slice(-2,-1))-Number(g[d[1][0]][d[0][0]].split('.').slice(-2,-1)));
	p[0].push(Number(g[d[0][0]][d[2][0]].split('.').slice(-2,-1))-Number(g[d[2][0]][d[0][0]].split('.').slice(-2,-1)));
	p[1].push(Number(g[d[1][0]][d[0][0]].split('.').slice(-2,-1))-Number(g[d[0][0]][d[1][0]].split('.').slice(-2,-1)));
	p[1].push(Number(g[d[1][0]][d[2][0]].split('.').slice(-2,-1))-Number(g[d[2][0]][d[1][0]].split('.').slice(-2,-1)));
	p[2].push(Number(g[d[2][0]][d[0][0]].split('.').slice(-2,-1))-Number(g[d[0][0]][d[2][0]].split('.').slice(-2,-1)));
	p[2].push(Number(g[d[2][0]][d[1][0]].split('.').slice(-2,-1))-Number(g[d[1][0]][d[2][0]].split('.').slice(-2,-1)))
	p.forEach(j=>{j.push(0);for (let i=2;i<6;i++){j[6]=j[6]+j[i]}})
	p.forEach(j=>{upd_user(j[0],{$inc:{'res.total':Math.round(j[6])}}).catch(err=>{catch_err(err)})})
	if(f){
		p.filter(i=>(i[6]==Math.max(...p.map(i=>i[6])))).forEach(j=>{
			upd_user(j[0],{$inc:{'res.pul.win':1}}).catch(err=>{catch_err(err)})
		})
	}
}

function set_pul(g,h,p,cost,f_p,x,n){
	if(p+cost<=f_p){g.pulya[g.trump[h][3]].pul=g.pulya[g.trump[h][3]].pul+String(p+cost)+'.'}
	else{
		if (f_p!==p){g.pulya[g.trump[h][3]].pul=g.pulya[g.trump[h][3]].pul+String(g.pulya.finish)+'.'}
		let diff=p+cost-f_p,v_p=[]
		for (let pl in g.pulya){
			if (pl==='finish'||pl===x){continue};v_p.push([pl,Number(val_from_pulya(g.pulya[pl].pul)),g.pulya[g.trump[h][3]][pl]])
		}
		if(v_p[0][1]<v_p[1][1]||(v_p[0][1]===v_p[1][1]&&h==='2-я рука')){v_p.reverse()}
		if(v_p[0][1]+diff<=f_p){
			g.pulya[v_p[0][0]].pul=g.pulya[v_p[0][0]].pul+String(v_p[0][1]+diff)+'.'
			g.pulya[g.trump[h][3]][v_p[0][0]]=v_p[0][2]+String(val_from_pulya(v_p[0][2])+diff*10)+'.'
		}
		else{diff=set_p_v_d(v_p[0],diff)	
			if (v_p[1][1]+diff<=f_p){
				g.pulya[v_p[1][0]].pul=g.pulya[v_p[1][0]].pul+String(v_p[1][1]+diff)+'.'
				g.pulya[g.trump[h][3]][v_p[1][0]]=v_p[1][2]+String(val_from_pulya(v_p[1][2])+diff*10)+'.'
			}
			else{diff=set_p_v_d(v_p[1],diff);g.pulya[g.trump[h][3]].gora=g.pulya[g.trump[h][3]].gora+String(n-diff)+'.'}
		}
		function set_p_v_d(v_p,diff){
			if (f_p!== v_p[1]){
				g.pulya[v_p[0]].pul=g.pulya[v_p[0]].pul+String(g.pulya.finish)+'.'
				g.pulya[g.trump[h][3]][v_p[0]]=v_p[2]+String(val_from_pulya(v_p[2])+(f_p-v_p[1])*10)+'.'
			}
			return v_p[1]+diff-f_p
		}
	}
}

function val_from_pulya(g){
	if (g){let v=g.split('.');	if (v.length===1){return Number(v[v.length-1])} else {return Number(v[v.length-2])}}
	else return 0
}