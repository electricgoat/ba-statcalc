/* Character stat calc - start */
const level_cap = 80;
const max_tier = [3, 7, 7, 6]; // Max tier for Weapon, Equipment 1, 2, 3
const reverse_ingame_stats = true; // Estimate raw numbers if provided data is sourced ingame

// Equipment max levels per tier
const equipment_level_preset = {1:10, 2:20, 3:30, 4:40, 5:45, 6:50, 7:55};
const weapon_level_preset = {1:30, 2:40, 3:50, 4:60, 5:70};


const rarity_bonus = {
	"attack"	: [0, 0, 1000,	2200, 3600, 5300 ],
	"defense"	: [0, 0, 0,		0,    0, 	0 	 ],
	"healing"	: [0, 0, 750, 	1750, 2950, 4450 ],
	"hp"		: [0, 0, 500, 	1200, 2100, 3500 ]
};

const equipment_stats = {'hat' : {
//	param			   N	T1		T2		T3		T4		T5		T6		T7
	'attack%' 		: [0,	8, 		13,		18,		25,		30,		35,		40 		],
	'attack' 		: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'defense%' 		: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'defense' 		: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'healing%' 		: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'healing' 		: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'hp%'			: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'hp'			: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],

	'crit_damage' 	: [0,	0, 		0, 		0,		800, 	1200,	1600,	1800 	],
	'crit_rate' 	: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'accuracy' 		: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'evasion' 		: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'cc_str'		: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'cc_res'	 	: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'crit_res' 		: [0,	0, 		0, 		0,		0, 		0,		0,		0 		],
	'critdamage_res': [0,	0, 		0, 		0,		0, 		0,		0,		0		],
	'healing_inc' 	: [0,	0, 		0, 		0,		0, 		0,		0,		0		],
},

'gloves' : {
	//	param			   N	T1		T2		T3		T4		T5		T6		T7
		'attack%'		: [0,	6.4, 	10.4,	14.4,	20,		25,		30,		35		],
		'crit_rate'	 	: [0,	0, 		0, 		0,		70,		200,	300,	350		],
		'accuracy' 		: [0,	0, 		0, 		0,		0, 		0,		30,		200		],
	},

'shoes' : {
	//	param			   N	T1		T2		T3		T4		T5		T6		T7
		'attack%'		: [0,	4, 		6.5,	9,		12.5,	20,		25,		30 		],
		'hp%'			: [0,	0, 		0, 		0,		6, 		9,		12,		13.5	],
	},

'bag' : {
	//	param			   N	T1		T2		T3		T4		T5		T6		T7
		'hp'			: [0,	600,	975,	1350,	1875,	3500,	5500,	7500	],
		'defense'		: [0,	0, 		0, 		0,		1000, 	1100,	1200,	1300	],
	},

'badge' : {
	//	param			   N	T1		T2		T3		T4		T5		T6		T7
		'hp'			: [0,	800,	1300,	1800,	2500,	4500,	6500,	9500	],
		'healing_inc'	: [0,	0, 		0, 		0,		1000, 	2000,	3000,	3200	],
		'hp%'			: [0,	0, 		0, 		0,		0,	 	10,		18,		22		],
		'evasion'		: [0,	0, 		0, 		0,		0,	 	0,		0,		400		],
	},

'hairpin' : {
	//	param			   N	T1		T2		T3		T4		T5		T6		T7
		'hp'			: [0,	400,	650,	950,	1250,	3000,	4500,	6500	],
		'cc_res'	 	: [0,	0, 		0, 		0,		10,		20,		24,		28 		],
	},

'charm' : {
	//	param			   N	T1		T2		T3		T4		T5		T6		T7
		'crit_res'		: [0,	80, 	130,	180,	250,	280,	320,	0 		],
		'critdamage_res': [0,	0, 		0, 		0,		1000,	1500,	1800,	0 		],
		'crit_rate'		: [0,	0, 		0, 		0,		0,		120,	150,	0 		],
	},

'watch' : {
	//	param			   N	T1		T2		T3		T4		T5		T6		T7
		'crit_rate'		: [0,	80, 	130,	180,	250,	280,	320,	0 		],
		'crit_damage' 	: [0,	0, 		0, 		0,		1000,	1500,	1800,	0 		],
		'hp%' 			: [0,	0, 		0, 		0,		0,		5,		7,		0 		],
	},

'necklace' : {
	//	param			   N	T1		T2		T3		T4		T5		T6		T7
		'healing%' 		: [0,	8, 		13, 	18,		25, 	28,		32,		0 		],
		'cc_str' 		: [0,	8, 		13, 	18,		25, 	28,		32,		0 		],
		'attack%' 		: [0,	0, 		0, 		0,		0,		4,		6,		0 		],
	},

};

const equipment_stats_list = Object.keys(equipment_stats.hat);

var stats = {};
var equipment = {};
var weapon = {};
var affection = {};
var tableCounter = 0;

	
$( document ).ready(function() {
	initStatCalc();
	$(".stattable-controls input").on("change mouseup keyup click", function(){levelChange($(this).closest("table"));statTableRecalc($(this).closest("table"));});
	$(".stattable-rarity-selector").children("img").on("click", function(){rarityChange($(this).closest("table"),$(this).attr('data-rarity'));statTableRecalc($(this).closest("table"));})

	$(".stattable-equipment-selector select").on("change", function(){equipmentChange($(this).closest("table"));statTableRecalc($(this).closest("table"));});
	$(".stattable-equipment-selector").find("img").on("click", function(){equipmentChange($(this).closest("table"),$(this).parent().attr('data-slot'));statTableRecalc($(this).closest("table"));})
});
	

function initStatCalc(){
	$(".character-stattable").each(function(){
		var id = 'statTable-'+(++tableCounter);
		$(this).attr('id',id);
		//console.log('StatCalc - init table id ' + id);
		
		var attack_data = $(this).find(".stat-attack").html().split('/');
		var defense_data = $(this).find(".stat-defense").html().split('/');
		var hp_data = $(this).find(".stat-hp").html().split('/');
		var healing_data = $(this).find(".stat-healing").html().split('/');
		var ammo_data = $(this).find(".stat-ammo").html().split('/');
		
				
		stats[id] = {};
		stats[id].rarity = !isNaN(parseInt($(document).find(".character-rarity").attr('data-value'))) ? parseInt($(document).find(".character-rarity").attr('data-value')) : 3 ;
		stats[id].level = level_cap;
		
		stats[id].attack_min	= parseInt(attack_data[0]) > 0 ? parseInt(attack_data[0]) : null;
		stats[id].attack_max	= parseInt(attack_data[1]) > 0 ? parseInt(attack_data[1]) : null;
		stats[id].defense_min	= parseInt(defense_data[0]) > 0 ? parseInt(defense_data[0]) : null;
		stats[id].defense_max	= parseInt(defense_data[1]) > 0 ? parseInt(defense_data[1]) : null;
		stats[id].hp_min		= parseInt(hp_data[0]) > 0 ? parseInt(hp_data[0]) : null;
		stats[id].hp_max		= parseInt(hp_data[1]) > 0 ? parseInt(hp_data[1]) : null;
		stats[id].healing_min	= parseInt(healing_data[0]) > 0 ? parseInt(healing_data[0]) : null;
		stats[id].healing_max	= parseInt(healing_data[1]) > 0 ? parseInt(healing_data[1]) : null;

		stats[id].accuracy	= parseInt($(this).find(".stat-accuracy").html()) > 0 ? parseInt($(this).find(".stat-accuracy").html()) : null;
		stats[id].evasion	= parseInt($(this).find(".stat-evasion").html()) > 0 ? parseInt($(this).find(".stat-evasion").html()) : null;
		stats[id].crit_rate	= parseInt($(this).find(".stat-crit_rate").html()) > 0 ? parseInt($(this).find(".stat-crit_rate").html()) : null;
		stats[id].crit_damage	= parseInt($(this).find(".stat-crit_damage").html()) > 0 ? parseInt($(this).find(".stat-crit_damage").html()) : null;
		stats[id].stability	= parseInt($(this).find(".stat-stability").html()) > 0 ? parseInt($(this).find(".stat-stability").html()) : null;
		stats[id].range		= parseInt($(this).find(".stat-range").html()) > 0 ? parseInt($(this).find(".stat-range").html()) : null;
		stats[id].cc_str	= parseInt($(this).find(".stat-cc_str").html()) > 0 ? parseInt($(this).find(".stat-cc_str").html()) : null;
		stats[id].cc_res	= parseInt($(this).find(".stat-cc_res").html()) > 0 ? parseInt($(this).find(".stat-cc_res").html()) : null;
		stats[id].move_speed	= parseInt($(this).find(".stat-move_speed").html()) > 0 ? parseInt($(this).find(".stat-move_speed").html()) : null;
		stats[id].ammo_count	= parseInt(ammo_data[0]) > 0 ? parseInt(ammo_data[0]) : null;
		stats[id].ammo_cost		= parseInt(ammo_data[1]) > 0 ? parseInt(ammo_data[1]) : null;
		stats[id].regen_cost	= parseInt($(this).find(".stat-regen_cost").html()) > 0 ? parseInt($(this).find(".stat-regen_cost").html()) : null;


		equipment[id] = {};
		equipment[id].bonus = {};


		var weapon_table = $(document).find(".weapontable");
		weapon[id] = {};
		weapon[id].current = {};
		weapon[id].rarity = 0;

		weapon[id].attack_min	= !isNaN(parseInt(weapon_table.attr('data-attack-val1'))) ? parseInt(weapon_table.attr('data-attack-val1')) : 0;
		weapon[id].attack_max	= !isNaN(parseInt(weapon_table.attr('data-attack-val100'))) ? parseInt(weapon_table.attr('data-attack-val100')) : 0;
		weapon[id].hp_min		= !isNaN(parseInt(weapon_table.attr('data-hp-val1'))) ? parseInt(weapon_table.attr('data-hp-val1')) : 0;
		weapon[id].hp_max		= !isNaN(parseInt(weapon_table.attr('data-hp-val100'))) ? parseInt(weapon_table.attr('data-hp-val100')) : 0;
		weapon[id].healing_min	= !isNaN(parseInt(weapon_table.attr('data-healing-val1'))) ? parseInt(weapon_table.attr('data-healing-val1')) : 0;
		weapon[id].healing_max	= !isNaN(parseInt(weapon_table.attr('data-healing-val100'))) ? parseInt(weapon_table.attr('data-healing-val100')) : 0;


		affection[id] = {};
		affection[id].bonus = {};
		
		//stats[$(this).attr('id')] = JSON.parse($(this).attr('stat-data'));
		if (!hasNull(stats[id])) 
		{
			// Estimate raw numbers
			if (reverse_ingame_stats && ($(this).attr('data-source') == 'ingame'))
			{ 
				console.log('StatCalc - Data source is set to ingame, calculator will attempt to estimate RAW values'); 
				fixedStats = calcReverseStat(level_cap,stats[id].rarity,'attack',stats[id].attack_min,stats[id].attack_max);
				stats[id].attack_min = fixedStats[0];
				stats[id].attack_max = fixedStats[1];

				fixedStats = calcReverseStat(level_cap,stats[id].rarity,'defense',stats[id].defense_min,stats[id].defense_max);
				stats[id].defense_min = fixedStats[0];
				stats[id].defense_max = fixedStats[1];

				fixedStats = calcReverseStat(level_cap,stats[id].rarity,'hp',stats[id].hp_min,stats[id].hp_max);
				stats[id].hp_min = fixedStats[0];
				stats[id].hp_max = fixedStats[1];

				fixedStats = calcReverseStat(level_cap,stats[id].rarity,'healing',stats[id].healing_min,stats[id].healing_max);
				stats[id].healing_min = fixedStats[0];
				stats[id].healing_max = fixedStats[1];
			}
			
			// Character rarity
			var img_regex = /<img[^>]+>/;
			var raritySelector = $(this).find(".stattable-rarity-selector");
			raritySelector.html(repeat(img_regex.exec($(".stattable-rarity-selector").find(".star-character").html())[0], 5)+" "+repeat(img_regex.exec($(".stattable-rarity-selector").find(".star-weapon").html())[0], max_tier[0]));		
			raritySelector.find("img").each(function(index){$(this).attr('data-rarity',index+1)});

			// Level
			$(this).find(".stattable-controls td").append('<div><span class="stattable-level-selector">Level: <input class="stattable-level" type="number" value="'+level_cap+'" step="1" min="1" max="100" /></span></div>'); 

			// Equipment
			var equipmentTable = $('.character-equipment');
			var equipmentControlsHTML = '';
			for (var index = 1; index <= 3; index++) {
				equipment[id][index] = {'type': equipmentTable.find(".equipment-"+index).attr('data-value'), 'image': equipmentTable.find(".equipment-"+index).find("a").html()};
				
				var itemTiersHTML = '';
				for (var tier = 1; tier <= max_tier[index]; tier++){ itemTiersHTML += '<option value="'+tier+'"'+ (tier == max_tier[index]?' selected':'') +'>T'+tier+'</option>'; }

				equipmentControlsHTML += '<div class="equipment-item equipment-'+index+'" data-type="'+equipment[id][index].type+'" data-slot="'+index+'">' + equipment[id][index].image + '<span class="stattable-equipment-tier-selector"><select class="stattable-tier">'+itemTiersHTML+'</select></span>' + '</div>'; 

			}
			$(this).find(".stattable-controls td>div").append('<span class="stattable-equipment-selector">'+equipmentControlsHTML+'</span>');


			$(this).find(".stattable-controls").css( "display", "" );	

			levelChange($(this));
			equipmentChange($(this));
			rarityChange($(this), stats[id].rarity);
			affectionGet($(this));
			statTableRecalc($(this));

		}
		else
		{ console.log('StatCalc - init cancelled due to incomplete data'); }

	});
}
	

function levelChange (statTable){
	//console.log('changing LEVEL in table '+statTable.attr('id'));
	
	var level = !isNaN(parseInt(statTable.find(".stattable-level").val())) ? parseInt(statTable.find(".stattable-level").val()) : 1 ;
	
	if (level < 1) 	 { statTable.find(".stattable-level").val(1);	level = 1; }
	if (level > 100) { statTable.find(".stattable-level").val(100); level = 100; }
	
	stats[statTable.attr('id')].level = level;
	
	//statTableRecalc(statTable);
}	


function equipmentChange (statTable, toggleSlot){
	toggleSlot = (typeof toggleSlot !== 'undefined') ? toggleSlot : false //default false, ES5 does not support function defaults
	//console.log('changing equipment in table '+statTable.attr('id'));
	//console.log(toggleSlot);
	if (toggleSlot) {
		var item_slot = statTable.find(".equipment-"+toggleSlot);
		(item_slot.hasClass("inactive")) ? item_slot.addClass('active').removeClass('inactive') : item_slot.addClass('inactive').removeClass('active');
	}


	equipment_stats_list.forEach(function (element){equipment[statTable.attr('id')].bonus[element] = 0;});


	for (var index = 1; index <= 3; index++) {
		if (!statTable.find(".stattable-equipment-selector .equipment-"+index+"").hasClass("inactive"))
		{
			var eq_type = statTable.find(".stattable-equipment-selector .equipment-"+index+"").attr('data-type');
			var eq_tier = statTable.find(".stattable-equipment-selector .equipment-"+index+" select").val();
			//console.log('Using equipment type ' + eq_type + ' at T' + eq_tier + ' in slot ' + index );

			equipment_stats_list.forEach(function (element){
				equipment[statTable.attr('id')].bonus[element] += ((typeof equipment_stats[eq_type][element] !== 'undefined' && typeof equipment_stats[eq_type][element][eq_tier] !== 'undefined')?equipment_stats[eq_type][element][eq_tier]:0);
			});
			//console.log(equipment[id].bonus);
		}
	};

	//statTableRecalc(statTable);
}	


function rarityChange (statTable, rarity){
	//console.log('changing RARITY in table '+statTable.attr('id')+' to '+rarity);
	var id = statTable.attr('id');
	
	stats[id].rarity = (rarity > 5) ? 5 : rarity;
	weapon[id].rarity = (rarity > 5) ? rarity-5 : 0;

	weapon[id].current.attack = weapon[id].rarity>0 ? calcWeaponStat( weapon_level_preset[weapon[id].rarity], weapon[id].attack_min, weapon[id].attack_max ) : 0;
	weapon[id].current.hp = weapon[id].rarity>0 ? calcWeaponStat( weapon_level_preset[weapon[id].rarity], weapon[id].hp_min, weapon[id].hp_max ) : 0;
	weapon[id].current.healing = weapon[id].rarity>0 ? calcWeaponStat( weapon_level_preset[weapon[id].rarity], weapon[id].healing_min, weapon[id].healing_max ) : 0;
	
	statTable.find(".stattable-rarity-selector").children().each(function(){ 
		($(this).attr('data-rarity') <= rarity) ? $(this).addClass('active').removeClass('inactive') : $(this).addClass('inactive').removeClass('active');
	});
	
	//statTableRecalc(statTable);
}


function affectionGet(statTable){
	//console.log('changing Affection bonus in table '+statTable.attr('id'));
	equipment_stats_list.forEach(function (element){affection[statTable.attr('id')].bonus[element] = 0;});

	if (typeof affection_data !== 'undefined') for (affectionTable in affection_data) {
		Object.keys(affection_data[affectionTable].current).forEach(function (statName){
			affection[statTable.attr('id')].bonus[statName.toLowerCase()] += affection_data[affectionTable].current[statName];
		});
	};

	//statTableRecalc(statTable);
}


function statTableRecalc(statTable){
	//console.log(id+' recalc called');
	var id = statTable.attr('id');

	statTable.find(".stat-attack").html(totalStat(	stats[id].level, stats[id].rarity, 'attack', 	stats[id].attack_min, stats[id].attack_max, equipment[id].bonus['attack%'], equipment[id].bonus['attack'] + weapon[id].current.attack + affection[id].bonus.attack ));
	statTable.find(".stat-defense").html(totalStat(	stats[id].level, stats[id].rarity, 'defense', 	stats[id].defense_min, stats[id].defense_max, equipment[id].bonus['defense%'], equipment[id].bonus['defense'] + affection[id].bonus.defense));
	statTable.find(".stat-hp").html(totalStat(		stats[id].level, stats[id].rarity, 'hp', 		stats[id].hp_min, stats[id].hp_max, equipment[id].bonus['hp%'], equipment[id].bonus['hp'] + weapon[id].current.hp + affection[id].bonus.hp ));
	statTable.find(".stat-healing").html(totalStat(	stats[id].level, stats[id].rarity, 'healing', 	stats[id].healing_min, stats[id].healing_max, equipment[id].bonus['healing%'], equipment[id].bonus['healing'] + weapon[id].current.healing + affection[id].bonus.healing ));

	statTable.find(".stat-accuracy").html(addBonus( 	stats[id].accuracy,	 	0, 							equipment[id].bonus['accuracy'] ));
	statTable.find(".stat-evasion").html(addBonus( 		stats[id].evasion,	 	0, 							equipment[id].bonus['evasion'] ));
	statTable.find(".stat-crit_rate").html(addBonus( 	stats[id].crit_rate,	0, 							equipment[id].bonus['crit_rate'] ));
	statTable.find(".stat-crit_damage").html(addBonus( 	stats[id].crit_damage,	0,		 					equipment[id].bonus['crit_damage'] ));
	//statTable.find(".stat-stability").html(addBonus( 	stats[id].stability,	0, 							0 ));
	statTable.find(".stat-cc_str").html(addBonus( 		stats[id].cc_str,	 	equipment[id].bonus['cc_str'], 	0 ));
	statTable.find(".stat-cc_res").html(addBonus( 		stats[id].cc_res,	 	equipment[id].bonus['cc_res'], 	0 ));


	//secondary values
	stats[id].damage_floor = stats[id].stability * 10000 / (stats[id].stability + 1000) + 2000;
	stats[id].one_cost_time = 10000 / stats[id].regen_cost


	statTable.find(".stattable-stats td").each(function () {
		$(this).attr("title", statTooltip(id, $(this).attr('class').substring(5)));
	})
}


function statTooltip(id, statName){
	var tooltip = '';
	
	tooltip += (typeof stats[id][statName+'_min'] !== 'undefined' && stats[id][statName+'_min'] > 0) ? 'Base: ' + calcStat(stats[id].level, stats[id].rarity, statName, stats[id][statName+'_min'], stats[id][statName+'_max']) : '';
	tooltip += (typeof stats[id][statName] !== 'undefined' && stats[id][statName] > 0) ? 'Base: ' + stats[id][statName] : '';
	tooltip += (typeof equipment[id].bonus[statName] !== 'undefined' && equipment[id].bonus[statName] > 0) ? '\r\nEquipment: ' + equipment[id].bonus[statName] : '';
	tooltip += (typeof weapon[id].current[statName] !== 'undefined' && weapon[id].current[statName] > 0) ? '\r\nWeapon: ' + weapon[id].current[statName] : '';
	tooltip += (typeof affection[id].bonus[statName] !== 'undefined' && affection[id].bonus[statName] > 0) ? '\r\nAffection: ' + affection[id].bonus[statName] : '';
	tooltip += (typeof equipment[id].bonus[statName+'%'] !== 'undefined' && equipment[id].bonus[statName+'%'] > 0) ? '\r\nEquipment: ' + equipment[id].bonus[statName+'%']+'%' 
	+ ' ('+ (parseInt(totalStat(stats[id].level, stats[id].rarity, statName, stats[id][statName+'_min'], stats[id][statName+'_max'], equipment[id].bonus[statName+'%'], equipment[id].bonus[statName] + weapon[id].current[statName]))-parseInt(totalStat(stats[id].level, stats[id].rarity, statName, stats[id][statName+'_min'], stats[id][statName+'_max'], 0, equipment[id].bonus[statName] + weapon[id].current[statName])))  +')' : '';

	if (statName == 'stability') tooltip += '\r\n——————————\r\nDamage floor: ' + (stats[id].damage_floor / 100).toFixed(2) + '%';
	if (statName == 'regen_cost') tooltip += '\r\n——————————\r\nSeconds per 1 cost: ' + (stats[id].one_cost_time).toFixed(2);
	if (statName == 'ammo') tooltip += 'Magazine size: ' + stats[id].ammo_count + '\r\n' + ((stats[id].ammo_cost>1)?'Ammo per burst: ':'Ammo per attack: ') + stats[id].ammo_cost;

	return tooltip;
}


function totalStat(level,rarity,statName,val1,val100,bonus_percent,bonus_flat){
	//console.log (statName + ': Using flat bonus ' + bonus_flat);
	//console.log (statName + ': Using % bonus ' + bonus_percent);

	var stat_value = calcStat(level,rarity,statName,val1,val100);
	stat_value = (stat_value+bonus_flat)*(1 + bonus_percent/100);

	return Math.ceil(stat_value);
}


function addBonus(stat_value,bonus_percent,bonus_flat){
	return Math.ceil((stat_value+bonus_flat)*(1 + bonus_percent/100));
}
	
	
function calcStat(level,rarity,statName,val1,val100){
	//return Math.ceil( (val1 + (val100 - val1) * (level - 1) / 99) * (10000 + rarity_bonus[statName][rarity]) / 10000 );
	return Math.ceil( Math.round(val1 + (val100 - val1) * (Math.round((level - 1) / 99 * 10000) / 10000)) * (10000 + rarity_bonus[statName][rarity]) / 10000 );
}
	
	
function calcReverseStat(startingLevel,startingRarity,statName,val1,val100){
	var rawVal1 = val1 / (10000 + rarity_bonus[statName][startingRarity]) * 10000;
	var rawVal100 = (val100 / (10000 + rarity_bonus[statName][startingRarity]) * 10000 - rawVal1) / (startingLevel - 1) * 99 + rawVal1;
	
	return [Math.floor(rawVal1), Math.floor(rawVal100)];
}


function calcWeaponStat(level,val1,val100){
	return Math.ceil(val1 + (val100 - val1) * Math.round((level - 1) / 99 * 10000) / 10000);
}
	
	
function hasNull(target) {
    for (var member in target) {
        if (target[member] == null)
            return true;
    }
    return false;
}


function repeat(string, count) {
    return new Array(count + 1).join(string);
}
/* Character stat calc - end */	