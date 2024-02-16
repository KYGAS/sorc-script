'use strict'

module.exports = function SorcySorc(mod) {
    
    let hooks = [],
        debug = false,
        playerLocation = {},
        partyMembers = [],
		enduranceEnemies = [],
		pvpEnemies = [],
		pvpEnemiesLocation = {},
		pvpEnemiesLife = {},
		pvpEnemiesHp = {},
		sleepEnemies = [],
		heldEnemies = [],
		plagueEnemies = [],
		npcLocations = [],
		petCollection = [],
        job = -1,
        glyphs = null,
		blockAniCancel = false,
		aniCancelTimer = null,
		mpState = 100,
		bossId = null,
		aspd = 1,
		meteorCd = false,
		twoFusionCd = false,
		lancesCd = false,
		fusionLock = false,
		ping = 40, 
		pingT;
		
	let idsToEnd = [],
		finishedIds = [];
		
	let speedyBoy = {
			"2-0": {
				"full": 1010,
				"max": 700,
				"optimal": 695,
				"min": 500
			},
			"3-0": {
				"full": 1307,
				"max": 1000,
				"optimal": 991, //849
				"min": 277
			},
			"6-0": {
				"full": 2161,
				"max": 1048,
				"optimal": 1045,
				"min": 979
			},
			"8-0": {
				"full": 1210,
				"max": 1200,
				"optimal": 1188,
				"min": 350
			},
			"10-0": {
				"full": 633,
				"max": 500,
				"optimal": 492,
				"min": 350
			},
			"11-0": {
				"full": 809,
				"max": 579,
				"optimal": 570,
				"min": 400
			},
			"12-0": {
				"full": 933,
				"max": 800,
				"optimal": 791,
				"min": 500
			},
			"17-0": {
				"full": 1106,
				"max": 952,
				"optimal": 1000,
				"min": 166
			},
			"27-0": {
				"full": 945,
				"max": 666,
				"optimal": 660,
				"min": 500
			},
			"27-30": {
				"full": 945,
				"max": 666,
				"optimal": 660,
				"min": 500
			},
			"30-0": {
				"full": 2858,
				"max": 400,
				"optimal": 397,
				"min": 400
			},
			"31-10": {
				"full": 500,
				"max": 300,
				"optimal": 300,
				"min": 300
			},
			"31-20": {
				"full": 500,
				"max": 300,
				"optimal": 300,
				"min": 300
			},
			"32-0": {
				"full": 3294,
				"max": 1818,
				"optimal": 1810,
				"min": 1727
			},
			"32-50": {
				"full": 2510,
				"max": 1048,
				"optimal": 1000,
				"min": 979
			},
			"41-5": {
				"full": 809,
				"max": 579,
				"optimal": 500,
				"min": 500
			}
		}

	let inCombat = false;
	let caster = null;
	
	const sleepableEnemies = {
		"444" : [ // Babar
			2201
		],
		"3037" : [ // Babar
			2201
		]
	};
	const plaguableEnemies = {
		"3105" : [ // FL
			1000
		],
		"3205" : [ // FL
			1000
		],
		"444" : [ // Babar
			1000,
			1001,
			2000,
			2001
		],
		"3037" : [ // Babar
			1000,
			1001,
			2000,
			2001
		],
		"2105" : [ // DASolo
			1000,
			1001,
			1002,
			1003,
			2000
		],
		"3102" : [	// DAN
			1000,
			1001,
			1002,
			1003
		],
		"3202" : [ // DAH
			1000,
			1001,
			1002,
			1003
		]
	};
    
    mod.command.add('sorc', (p1, p2)=> {
        if (p1) p1 = p1.toLowerCase();
        if (p1 == null) {
            mod.settings.enabled = !mod.settings.enabled;
        } else if (p1 === 'off') {
            mod.settings.enabled = false;
        } else if (p1 === 'on') {
            mod.settings.enabled = true;
        } else if (p1 === 'debug') {
            debug = !debug;
            mod.command.message('Debug ' + (debug ? 'enabled' : 'disabled'));
            return;
        } else if (p1 === 'test') {
            outputDebug(0);
            return;
        } else if (!isNaN(p1)) {
            mod.settings.enabled = true;
            mod.settings.delay = parseInt(p1)
        } else {
			switch(p1){
				case 'ping':
					if(isNaN(p2)){
						mod.command.message('Ping is a number, stop being autistic.')
						mod.command.message('/8 sorcerer ping VALUE')
						return;
					}
					mod.settings.myPing = parseInt(p2)
					mod.command.message( p1 + ' set to ' + mod.settings.myPing )
					break;
				case 'instanthit':
					mod.settings.instantHit = !mod.settings.instantHit;
					mod.command.message( p1 + ' set to ' + mod.settings.instantHit )
					break;
				case 'hitbossonly':
					mod.settings.hitBossOnly = !mod.settings.hitBossOnly;
					mod.command.message( p1 + ' set to ' + mod.settings.hitBossOnly)
					break;
				case 'instantlock':
					mod.settings.instantLock = !mod.settings.instantLock;
					mod.command.message( p1 + ' set to ' + mod.settings.instantLock )
					break;
				case 'instantcast':
					mod.settings.instantCast = !mod.settings.instantCast;
					mod.command.message( p1 + ' set to ' + mod.settings.instantCast )
					break;
				case 'autoaim':
					mod.settings.autoAim = !mod.settings.autoAim;
					mod.command.message( p1 + ' set to ' + mod.settings.autoAim )
					break;
				case 'forceprimeflame':
					mod.settings.forcePrimeFlame = !mod.settings.forcePrimeFlame;
					mod.command.message( p1 + ' set to ' + mod.settings.forcePrimeFlame )
					break;
				case 'predictarcanepulsecharge':
					mod.settings.predictArcanePulseCharge = !mod.settings.predictArcanePulseCharge;
					mod.command.message( p1 + ' set to ' + mod.settings.predictArcanePulseCharge )
					break;
				case 'predictarcanepulsemanacost':
					mod.settings.predictArcanePulseManaCost = !mod.settings.predictArcanePulseManaCost;
					mod.command.message( p1 + ' set to ' + mod.settings.predictArcanePulseManaCost )
					break;
				case 'fastimplosion':
					mod.settings.fastImplosion = !mod.settings.fastImplosion;
					mod.command.message( p1 + ' set to ' + mod.settings.fastImplosion )
					break;
				case 'fastfusion':
					mod.settings.fastFusion = !mod.settings.fastFusion;
					mod.command.message( p1 + ' set to ' + mod.settings.fastFusion )
					break;
				case 'comboprimeflameinmanaboost':
					mod.settings.comboPrimeFlameInManaBoost = !mod.settings.comboPrimeFlameInManaBoost;
					mod.command.message( p1 + ' set to ' + mod.settings.comboPrimeFlameInManaBoost )
					break;
				case 'lancemacro':
					mod.settings.lanceMacro = !mod.settings.lanceMacro;
					mod.command.message( p1 + ' set to ' + mod.settings.lanceMacro)
					break;
				case 'ethicaldistance':
					mod.settings.ethicalDistance = !mod.settings.ethicalDistance;
					mod.command.message( p1 + ' set to ' + mod.settings.ethicalDistance)
					break;
				case 'autolances':
					mod.settings.autoLances = !mod.settings.autoLances;
					mod.command.message( p1 + ' set to ' + mod.settings.autoLances)
					break;
				default:
					mod.command.message('Invalid command. DM developer for more info!')
					break;
			}
            return;
        }        
        mod.command.message('Sorc ' + (mod.settings.enabled ? 'enabled (' + mod.settings.delay + '%)' : 'disabled'));
    });
    mod.command.add('sorcerermod', (p1)=> {
        if (!isNaN(p1)) {
            mod.settings.modifier = Number(p1);
        } else {
            mod.command.message(p1 +' is an invalid argument');
            return;
        }
		mod.command.message('Sorc ' + (mod.settings.enabled ? 'enabled (' + mod.settings.modifier + '%)' : 'disabled'));
    });

		
    mod.game.on('enter_game', () => { 
        job = (mod.game.me.templateId - 10101) % 100;
        (job==4) ? load() : unload();
    })
       
    function hook() {
        hooks.push(mod.hook(...arguments));
    }
    
    function unload() {
        if (hooks.length) {
            for (let h of hooks)
                mod.unhook(h);
            hooks = [];
        }
    }
    
    function load() {
        if (!hooks.length) {
            
            hook('S_PARTY_MEMBER_LIST', 9, (event) => {             
                const copy = partyMembers;          
                partyMembers = event.members.filter(m => m.playerId != mod.game.me.playerId); // remove self from targets
                
                // restore missing gameIds. sometimes gameIds are 0 since 64-bit patch
                if (copy) {
                    for(let i = 0; i < partyMembers.length; i++) {
                        const copyMember = copy.find(m => m.playerId == partyMembers[i].playerId);
                        if (copyMember) {
                            partyMembers[i].gameId = copyMember.gameId;
                            if (copyMember.loc) partyMembers[i].loc = copyMember.loc;
                        }
                    }
                }
				


            })
            
            hook('S_LEAVE_PARTY', 1, (event) => {
                partyMembers = [];
				

            })
            
            hook('C_PLAYER_LOCATION', 5, (event) => {
                playerLocation = event;
				

            })
            
            hook('S_SPAWN_ME', 3, (event) => {
                playerLocation.loc = event.loc;
                playerLocation.w = event.w;

            })
            
            hook('S_SPAWN_USER', 17, (event) => {

                if (partyMembers.length != 0) {
                    let member = partyMembers.find(m => m.playerId === event.playerId);
                    if (member) {
                        member.gameId = event.gameId;
                        member.loc = event.loc;
                        member.alive = event.alive;
                        member.hpP = (event.alive ? 100 : 0);
                    }
                }
            })
            
            hook('S_USER_LOCATION', 6, (event) => {
                let member = partyMembers.find(m => m.gameId === event.gameId);
                if (member) member.loc = event.loc;

            })
            
            hook('S_USER_LOCATION_IN_ACTION', 2, (event) => {

                let member = partyMembers.find(m => m.gameId === event.gameId);
                if (member) member.loc = event.loc;
            })
            
            hook('S_INSTANT_DASH', 3, (event) => {

                let member = partyMembers.find(m => m.gameId === event.gameId);
                if (member) member.loc = event.loc;
            })
            
            hook('S_PARTY_MEMBER_CHANGE_HP', 4, (event) => {

                if (mod.game.me.playerId == event.playerId) return;
                let member = partyMembers.find(m => m.playerId === event.playerId);
                if (member) {
                    member.hpP = (Number(event.currentHp) / Number(event.maxHp)) * 100;
                }
            })
            
            hook('S_PARTY_MEMBER_STAT_UPDATE', 4, (event) => {

                if (mod.game.me.playerId == event.playerId) return;
                let member = partyMembers.find(m => m.playerId === event.playerId);
                if (member) {
                    member.hpP = (Number(event.hp) / Number(event.maxHp)) * 100;    
                    member.alive = event.alive;
                }
            })
            
            hook('S_PLAYER_STAT_UPDATE', 17, (event) => {

                    mpState = (Number(event.mp) / Number(event.maxMp)) * 100;
					aspd = (event.attackSpeed + event.attackSpeedBonus) / event.attackSpeed;
            })
            
            hook('S_DEAD_LOCATION', 2, (event) => {

                let member = partyMembers.find(m => (m.gameId === event.gameId));
                if (member) {
                    member.loc = event.loc;
                    member.hpP = 0;
                    member.alive = false;
                }
				
            })
            
            hook('S_LEAVE_PARTY_MEMBER', 2, (event) => {

                partyMembers = partyMembers.filter(m => m.playerId != event.playerId);                
            });
             
            hook('S_LOGOUT_PARTY_MEMBER', 1, (event) => {

                let member = partyMembers.find(m => m.playerId === event.playerId);
                if (member) member.online = false;                
            });
            
            hook('S_BAN_PARTY_MEMBER', 1, (event) => {

                partyMembers = partyMembers.filter(m => m.playerId != event.playerId);
            });
            
            
            hook('S_SPAWN_USER', 17, (event) => {

				if ([3].includes(event.relation) ) {
					if(!pvpEnemies.includes(event.gameId) ){
						pvpEnemies.push(event.gameId);
					}
					pvpEnemiesLife[event.gameId] = event.alive;
					pvpEnemiesLocation[event.gameId] = event.loc;
				}
            })
			
			hook('S_SHOW_HP', 3, (event) => {

				if ( event.enemy == 1) {
					//console.log(pvpEnemies)
					if(!pvpEnemies.includes(event.gameId) ){
						pvpEnemies.push(event.gameId);
						pvpEnemiesLife[event.gameId] = true;
						pvpEnemiesHp[event.gameId] = event.curHp;
					}
				}
				else if ( event.enemy == 0 || event.curHp < 1000) {
					//console.log(pvpEnemies)
					if(pvpEnemies.includes(event.gameId)){
						pvpEnemies.splice(
							pvpEnemies.indexOf(event.gameId),
							1
						)
						delete pvpEnemiesLocation[event.gameId]
						delete pvpEnemiesLife[event.gameId]
						delete pvpEnemiesHp[event.gameId]
					}
				}						
            })
            
			
			
            hook('S_USER_LOCATION', 6, (event) => {
				if(pvpEnemies.includes(event.gameId)) pvpEnemiesLocation[event.gameId] = event.loc;
            })
			
            hook('S_ACTION_STAGE', 9, (event) => {
				if(pvpEnemies.includes(event.gameId)) pvpEnemiesLocation[event.gameId] = event.loc;
            })
			
            hook('S_ACTION_END', 5, (event) => {
				if(pvpEnemies.includes(event.gameId)) pvpEnemiesLocation[event.gameId] = event.loc;
            })
            
            hook('S_USER_LOCATION_IN_ACTION', 2, (event) => {
				if(pvpEnemies.includes(event.gameId)) pvpEnemiesLocation[event.gameId] = event.loc;
            })
            
            hook('S_INSTANT_DASH', 3, (event) => {
				if(pvpEnemies.includes(event.gameId)) pvpEnemiesLocation[event.gameId] = event.loc;
            })
			
            hook('S_CREATURE_LIFE', 3, (event) => {
				pvpEnemiesLife[event.gameId] = event.alive;
            })
			
            hook('S_CREATURE_CHANGE_HP', 6, (event) => {
				//if(pvpEnemiesLocation[event.gameId]) pvpEnemiesLocation[event.gameId] = event.loc;
				// curHp maxHp
				// target
				// abnormId ?? stack VoC ??
				//
				//
				
				if(pvpEnemies[event.target])
					pvpEnemiesHp[event.target] = event.curHp;
				
				
            })
			
            hook('S_DEAD_LOCATION', 2, (event) => {
				pvpEnemiesLife[event.gameId] = false;
            })
			

			hook('S_DESPAWN_USER', 3, (event) => {

				if(pvpEnemies.includes(event.gameId)){
					pvpEnemies.splice(
						pvpEnemies.indexOf(event.gameId),
						1
					)
					delete pvpEnemiesLocation[event.gameId]
					delete pvpEnemiesLife[event.gameId]
					delete pvpEnemiesHp[event.gameId]
				}
            });
            
            hook('S_BOSS_GAGE_INFO', 3, (event) => {
				const i = enduranceEnemies.indexOf(event.id);
				if (i > -1) {
					enduranceEnemies.splice(i, 1);
				}
				enduranceEnemies.push(event.id);
				bossId = event.id;
            });
            
            hook('S_SPAWN_NPC', 12, (event) => {

				if(
					sleepableEnemies[event.huntingZoneId]
				)if(
					sleepableEnemies[event.huntingZoneId].includes(event.templateId)
				)	sleepEnemies.push(event.gameId);
				
				if(
					plaguableEnemies[event.huntingZoneId]
				)if(
					plaguableEnemies[event.huntingZoneId].includes(event.templateId)
				)	plagueEnemies.push(event.gameId);
				
				npcLocations[event.gameId] = event.loc; // potentially make this more reliable, cba tho
				
				/* test */
				
				
				//10238008
				
				if(event.templateId == 10238008 && event.huntingZoneId == 1023 && event.owner == mod.game.me.gameId ){
					petCollection.push( event.gameId )
				}
				
            });

            hook('S_ACTION_END', 5, { filter : { fake : null } }, (event) => {

				if(Math.floor(event.skill.id/10000) == 10){
					if (event.gameId != mod.game.me.gameId) return;
					blockAniCancel = false;
				}
			})

			hook('S_DESPAWN_NPC', 3, (event) => {

				const i = enduranceEnemies.indexOf(event.gameId);
				if (i > -1) {
					enduranceEnemies.splice(i, 1);
				}
				const j = sleepEnemies.indexOf(event.gameId);
				if (j > -1) {
					sleepEnemies.splice(j, 1);
				}
				const k = plagueEnemies.indexOf(event.gameId);
				if (k > -1) {
					plagueEnemies.splice(k, 1);
				}
				const l = heldEnemies.indexOf(event.gameId);
				if (l > -1) {
					heldEnemies.splice(l, 1);
				}
				const m = npcLocations.indexOf(event.gameId);
				if (m > -1) {
					npcLocations.splice(m, 1);
				}
				const n = petCollection.indexOf(event.gameId);
				if (n > -1) {
					petCollection.splice(n, 1);
					mod.clearTimeout(aniCancelTimer)
					//stop command
				}
            });
			
            hook('S_NPC_LOCATION', 3, (event) => {

				npcLocations[event.gameId] = event.loc; // potentially make this more reliable, cba tho
				
            });
			
			hook('S_ACTION_STAGE', 9, { order : -Infinity, filter : { fake : null }} , (event) => { // implosion cancel
				 if(!npcLocations[event.gameId]) return;
				 
				 npcLocations[event.gameId] = event.loc
				 if( event.dest.x != 0 )
					npcLocations[event.gameId] = event.dest;
			})
			
			hook('S_ACTION_END', 5, { order : -Infinity, filter : { fake : null }} , (event) => { // implosion cancel
				 if(!npcLocations[event.gameId]) return;
				 
				 npcLocations[event.gameId] = event.loc
			})

            hook('S_LOAD_TOPO', 'event', (event) => {

				enduranceEnemies = [];
				sleepEnemies = [];
				plagueEnemies = [];
				npcLocations = [];
				heldEnemies = [];
				petCollection = [];
            });
			
			
			
			hook('S_ABNORMALITY_BEGIN', 5, (event) => {
				if( ! [30372204, 90442204].includes(event.id) ) return;
				const i = sleepEnemies.indexOf(event.target);
				if (i > -1) {
					sleepEnemies.splice(i, 1);
				}
				const j = heldEnemies.indexOf(event.target);
				if (j > -1) {
					heldEnemies.splice(j, 1);
				}
            });
			
			hook('S_ABNORMALITY_BEGIN', 5, (event) => {
				if( ! [90442202, 30372202].includes(event.id) ) return;
				const i = sleepEnemies.indexOf(event.target);
				if (i == -1) {
					sleepEnemies.push(event.target);
				}
            })
			
            hook('S_ABNORMALITY_BEGIN', 5, (event) => {
				if( ! [701101, 801202].includes(event.id) ) return;
				const i = sleepEnemies.indexOf(event.target);
				if (i > -1) {
					heldEnemies.push( sleepEnemies.splice(i, 1)[0] );
				}
            });
			
            hook('S_ABNORMALITY_END', 1, (event) => {
				if( ! [701101, 801202].includes(event.id) ) return;
				const i = heldEnemies.indexOf(event.target);
				if (i > -1) {
					sleepEnemies.push( heldEnemies.splice(i, 1)[0] );
				}
            });
			
			
            hook('S_START_USER_PROJECTILE', 9, { order : -Infinity, filter : { fake : false }}, (event) => { // instant hit
				
					if(event.gameId != mod.game.me.gameId) return;
					if(!mod.settings.enabled) return;
					if(!mod.settings.instantHit) return;
					
					let skill = Math.floor(event.skill.id / 10000);
					
					if( mod.settings.instaHitSkills.includes(skill) ){
						let targetEnemies = [];
						let maxTargetCount = getMaxTargets(skill);
						
						targetEnemies = targetEnemies.concat([bossId]);
						
						if(!mod.settings.hitBossOnly)
							switch(skill){
									case 1:
									case 2:
									case 4:
									case 12:
									case 33:
									case 35:
									targetEnemies = targetEnemies.concat(enduranceEnemies);
									break;
								default :
									return;
							}
						
						
						if (targetEnemies.length == 0) return; // have potential targets
						let finalEnemies = [];
						
						for (let i = 0, n = targetEnemies.length; i < n; i++) {
							if ( npcLocations[targetEnemies[i]] != undefined &&
								(npcLocations[targetEnemies[i]].dist3D(playerLocation.loc) / 25) <= ( mod.settings.ethicalDistance ? event.distance : 1000 ) ) {
									finalEnemies.push({
										gameId : targetEnemies[i],
										unk : 0
									});
									if (finalEnemies.length == maxTargetCount) break;
								}
						}
						if (finalEnemies.length > 0) {
							setTimeout(()=>{
									
									mod.toServer("C_HIT_USER_PROJECTILE", 4, {
										id : event.id,
										end : false,
										loc : event.loc,
										targets: finalEnemies
									});
							},10);
						}
					}
					
            })
			
            hook('C_PRESS_SKILL', 5	, { order : -Infinity, filter : { fake : null}}, (event) => { // mp check
				
				if(!mod.settings.enabled) return;
				
				let skill = Math.floor(event.skill.id / 10000);
				
				if([4, 33].includes(skill) )
				{
					if(mpState <= 10 && event.press && mod.settings.predictArcanePulseManaCost) {
						mod.send('S_CANNOT_START_SKILL', 4, event)
						return false;
					}
				}
            })
			
			
            hook('C_PRESS_SKILL', 5	, { order : -Infinity, filter : { fake : false}}, (event) => { // hold charge
				
				if(!mod.settings.enabled) return;
				
				let skill = Math.floor(event.skill.id / 10000);
				
				if([4, 19, 33].includes(skill) )
				{
					if(event.press == false && mod.settings.predictArcanePulseCharge) return false;
				}
            })
			
            hook('S_ACTION_STAGE', 9, { order : Infinity, filter : { fake : null }} , (event) => { // auto charge
				if(event.gameId != mod.game.me.gameId) return;
				if(!mod.settings.enabled) return;
				if( [4, 19, 33].includes( Math.floor(event.skill.id/10000) ) ) // ap - mana siphon - ap
					if( event.stage == 2 ) 
						if( mod.settings.predictArcanePulseCharge ){
							mod.setTimeout(()=>{
								mod.send('C_PRESS_SKILL', 5, 
									Object.assign(event,{unkn2 : true, press : false}) )
							}, ping/2)
						}
            })
			
            hook('S_ACTION_STAGE', 9, { order : Infinity, filter : { fake : null }} , (event) => { // implosion cancel
				if(event.gameId != mod.game.me.gameId) return;
				if(!mod.settings.enabled) return;
				if( [36].includes( Math.floor(event.skill.id/10000) ) ){
					if( mod.settings.fastFusion ) {
						let modifier = 1.08;
						let delay = 905;
						
						if(event.skill.id % 1000 == 600){
							return;
						}
						
						event.projectileSpeed = event.speed *= modifier;
						mod.setTimeout(()=>{
							mod.send('C_CANCEL_SKILL', 3, {
								skill : event.skill,
								type : 2
							})
							mod.send('S_ACTION_END', 5, Object.assign(event, { type : 4 }))
						}, delay/event.speed)
						return true;
					}
				}
				if( [39].includes( Math.floor(event.skill.id/10000) ) ) 
						if( mod.settings.fastImplosion && !meteorCd){
							mod.setTimeout(()=>{
								mod.send('S_ACTION_END', 5, Object.assign(event, { type : 6 }))
								mod.send('C_START_SKILL', 7, 
									Object.assign(event, { skill : {reserved:0,npc:false,type:1,huntingZoneId:0,id:61000} } )
								)
							}, 75)
						}
            })
			
			hook('C_START_SKILL', 7, { order : -Infinity, filter : { fake : null}}, (event) => {
				
				if(!mod.settings.enabled) return;
				
					if (event.skill.id / 10 & 1 != 0) { // is casting (opposed to locking on)
						playerLocation.w = event.w;
						return;
					}
					
					
					let skill = Math.floor(event.skill.id / 10000);
					if( mod.settings.instaLockSkills.includes(skill) ){
						let targetEnemies = [];
						let maxTargetCount = getMaxTargets(skill);
						
						
						switch(skill){
							case 23:
							case 22:
							case 21:
							case 20:
								targetEnemies = targetEnemies.concat(enduranceEnemies);
								break;
							default :
								return;
						}
						
						if (targetEnemies.length == 0) return; // have potential targets
						let finalEnemies = [];
						
						for (let i = 0, n = targetEnemies.length; i < n; i++) {
							if ( npcLocations[targetEnemies[i]] != undefined &&
								(npcLocations[targetEnemies[i]].dist3D(playerLocation.loc) / 25) <= mod.settings.maxDistance) {
									finalEnemies.push(targetEnemies[i]);
									if (finalEnemies.length == maxTargetCount) break;
								}
						}
						
						if (finalEnemies.length > 0) {
							if (debug) outputDebug(event.skill);
							
							for (let i = 0, n = finalEnemies.length; i < n; i++) {
								setTimeout(() => {
									mod.send('C_CAN_LOCKON_TARGET', 3, {target: finalEnemies[i], skill: event.skill.id});
								}, mod.settings.myPing/2 + 5);
							}
							
							if (mod.settings.instantCast) {
								setTimeout(() => {
									mod.send('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
								}, (mod.settings.myPing/2 + 5) * finalEnemies.length + mod.settings.myPing + 5 );
							}
						}
					}
            })
			
			
			hook('C_START_SKILL', 7, { order : -Infinity, filter : { fake : null}}, (event) => {
				if(!mod.settings.enabled) return;

				
				if(!mod.settings.autoAim) return;
				
				if(!npcLocations[bossId]) return;
				
				if( Math.floor(event.skill.id / 10000) == 4 ) {
					
					event.w = Math.atan2(npcLocations[bossId].y - event.loc.y, npcLocations[bossId].x - event.loc.x);
					
					event.dest.x = event.loc.x + 530 * Math.cos(event.w)
					event.dest.y = event.loc.y + 530 * Math.sin(event.w)
					event.dest.z = event.loc.z + 25;
					return true;
				}
			
				if( Math.floor(event.skill.id / 10000) == 33 ) {
					
					event.w = Math.atan2(npcLocations[bossId].y - event.loc.y, npcLocations[bossId].x - event.loc.x);
					
					event.dest.x = event.loc.x + 530 * Math.cos(event.w)
					event.dest.y = event.loc.y + 530 * Math.sin(event.w)
					event.dest.z = event.loc.z + 25;
					return true;
				}
			
				if( Math.floor(event.skill.id / 10000) == 35 ) {
					
					event.w = Math.atan2(npcLocations[bossId].y - event.loc.y, npcLocations[bossId].x - event.loc.x);
					
					event.dest.x = event.loc.x + 380 * Math.cos(event.w)
					event.dest.y = event.loc.y + 380 * Math.sin(event.w)
					event.dest.z = event.loc.z + 25;
					return true;
				}
			
				if( Math.floor(event.skill.id / 10000) == 36 ) {
					// angle in radians
					
					event.w = Math.atan2(npcLocations[bossId].y - event.loc.y, npcLocations[bossId].x - event.loc.x);
					
					event.dest.x = event.loc.x + 1970 * Math.cos(event.w)
					event.dest.y = event.loc.y + 1970 * Math.sin(event.w)
					event.dest.z = event.loc.z;
					if(mod.settings.forcePrimeFlame && event.skill.id % 1000 != 600) event.skill.id = 360200;
					return true;
				}

            })
			
			hook('S_ACTION_STAGE', 9, { order : Infinity, filter : { fake : null }} , (event) => { // implosion cancel
				 if(event.gameId != mod.game.me.gameId) return;
				 if(!mod.settings.enabled) return;
				 
				 if([3, 4, 6, 8, 11, 12, 17, 20, 30, 32, 33, 36, 39, 41].includes( Math.floor( event.skill.id/10000) ) ){
					 if(mod.settings.autoLances)
						if(inCombat)
							if(!lancesCd)
								mod.send("S_GRANT_SKILL", 3, {skill: { reserved: 0, npc: false, type: 1, huntingZoneId: 0, id: 350100 }} );
				 }
			})
			
			hook('C_START_SKILL', 7, { order : -Infinity, filter : { fake : null}}, (event) => {
				if(!mod.settings.enabled) return;

				if([7, 10, 14, 18, 26, 28, 31, 36].includes(Math.floor(event.skill.id / 10000))) return;
				if(fusionLock) return false;
			})
			
            hook('C_PRESS_SKILL', 5	, { order : -Infinity, filter : { fake : null}}, (event) => { // hold charge
				if(!mod.settings.enabled) return;

				if([7, 10, 14, 18, 26, 28, 31, 36].includes(Math.floor(event.skill.id / 10000))) return;
				if(fusionLock) return false;
			})
			
			hook('C_START_SKILL', 7, { order : -Infinity, filter : { fake : false }}, (event) => {
				if(!mod.settings.enabled) return;

				if(!mod.settings.autoAim) return;
				if(!npcLocations[bossId]) return;
				if(twoFusionCd) return;
				
				if( Math.floor(event.skill.id / 10000) == 36 ) {
					// angle in radians
					
					if(mod.settings.comboPrimeFlameInManaBoost && event.skill.id % 1000 == 600 ){
						event.skill.id = 360200
						let y = Object.assign({}, event)
						fusionLock = true;
						setTimeout(()=>{
							fusionLock = false;
							y.skill.id = 360600
							mod.send('C_START_SKILL', 7, y);
						}, mod.settings.delay/aspd)
					}
				}
				return true;
            })
			
    
            hook('S_CREST_INFO', 2, (event) => {
                glyphs = event.crests;
            })
            
            hook('S_CREST_APPLY', 2, (event) => {
                let glyph = glyphs.find(g => g.id == event.id);
                if (glyph) glyph.enable = event.enable;                
            })
			
			hook('S_START_COOLTIME_SKILL', 4, (event)=>{
				if(!mod.settings.enabled) return;
				  if([6, 32].includes(Math.floor(event.skill.id / 10000)) )
				  {
					  meteorCd = true;
					  setTimeout(()=>{
						  meteorCd = false;
					  }, event.cooldown - 25)
				  }
				  if(event.skill.id == 360200)
				  {
					  twoFusionCd = true;
					  setTimeout(()=>{
						  twoFusionCd = false;
					  }, event.cooldown - 25)
				  }
				  if(Math.floor(event.skill.id / 10000) == 35){
					  lancesCd = true;
					  setTimeout(()=>{
						  lancesCd = false;
					  }, event.cooldown - 25)
				  }
				if(mod.settings.lanceMacro){
				  if(Math.floor(event.skill.id / 10000) == 35)
				  {
					  let rn = Math.random() * 100 + 50;
					  
					  clearTimeout(caster);
					  caster = setTimeout( () => {
						if(!mod.settings.enabled) return;
						
						if(!inCombat) return;
						
						mod.send("S_GRANT_SKILL", 3, {skill: { reserved: 0, npc: false, type: 1, huntingZoneId: 0, id: 350100 }} );
						
					  }, event.cooldown + Math.round(rn));
				  }
				}
			});
			
			mod.game.me.on('enter_combat', () => {
				inCombat = true;
			})
			
			mod.game.me.on('leave_combat', () => { 
				inCombat = false;
			})
            
			/*
			
			fast sorc
			
			*/
			
			
			hook('S_ACTION_STAGE', 9, { order : Infinity, filter : { fake : null }} , (event) => { // implosion cancel
				 if(event.gameId != mod.game.me.gameId) return;
				 if(!mod.settings.enabled) return;
				 
				 if(speedyBoy[Math.floor(event.skill.id/10000) + '-' + event.skill.id%100]){
					 idsToEnd.push(event.id)
					 event.speed = event.projectileSpeed *= speedyBoy[Math.floor(event.skill.id/10000) + '-' + event.skill.id%100].max/speedyBoy[Math.floor(event.skill.id/10000) + '-' + event.skill.id%100].optimal
					 setTimeout(()=>{
						 mod.send('S_ACTION_END', 5, Object.assign(event, { type : 4 }))
					 }, speedyBoy[Math.floor(event.skill.id/10000) + '-' + event.skill.id%100].full/(
						speedyBoy[Math.floor(event.skill.id/10000) + '-' + event.skill.id%100].max/
						speedyBoy[Math.floor(event.skill.id/10000) + '-' + event.skill.id%100].optimal*event.speed))
				 }
				 
			})
			
			
			hook('C_REQUEST_GAMESTAT_PING', 'raw', { order : -Infinity, filter : { fake : null } }, ()=>{
				pingT = Date.now()
				mod.hookOnce('S_RESPONSE_GAMESTAT_PONG', 'raw', { order : -Infinity, filter : { fake : null } }, ()=>{
					ping = (Date.now() - pingT)<500?Date.now() - pingT:ping;
				})
			})
			
			hook("S_ACTION_END", 5, { order : +1000, filter : { fake : null } }, event => {
				if(!mod.settings.enabled) return;
				if(event.gameId != mod.game.me.gameId) return;
				if(!idsToEnd.includes(event.id)) return;
				if(!speedyBoy[Math.floor( event.skill.id/10000 )	+ '-' + event.skill.id%100]) return;
				if(finishedIds.length > 4) finishedIds.splice(0,1)
				if(finishedIds.includes(event.id) ) return false;
				finishedIds.push(event.id)
			})
			
        }
    }

    function getMaxTargets (skill) {
		return 15;
    }
    
    function isGlyphEnabled(glyphId) {
        let glyph = glyphs.find(g => g.id == glyphId && g.enable);
        if (glyph) return true;
        else return false;        
    }
    
    function sortHp() {
        partyMembers.sort(function (a, b) {
            return parseFloat(a.hpP) - parseFloat(b.hpP);
        });
    }
        
    function outputDebug(skill) {
        let out = '\tSorc Script... Skill: ' + skill.id + '\tpartyMemebers.length: ' + partyMembers.length;
        for (let i = 0; i < partyMembers.length; i++) {
            out += '\n' + i + '\t';
            let name = partyMembers[i].name;
            name += ' '.repeat(21-name.length);
            let hp = '\tHP: ' + parseFloat(partyMembers[i].hpP).toFixed(2);
            let dist = '\tundefined';
            if (partyMembers[i].loc) dist = '\tDist: ' + (partyMembers[i].loc.dist3D(playerLocation.loc) / 25).toFixed(2);
           // let vert = '\tVert: ' + (Math.abs(partyMembers[i].loc.z - playerLocation.loc.z) / 25).toFixed(2);
            let online = '\tOnline: ' + partyMembers[i].online;
            let alive = '\tAlive: ' + partyMembers[i].alive;
            let pid = '\tpid: ' + partyMembers[i].playerId + '  gid: ' + partyMembers[i].gameId  ;
            out += name + hp + dist + online + alive + pid;
        }
        console.log(out)
    }
    
}