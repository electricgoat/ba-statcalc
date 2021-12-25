/* Character stat calc - start */
const level_cap = 75;
const fix_ingame_stats = true; //attempt to recalculate raw numbers if provided data looks like ingame stats

const rarity_bonus = {
	"attack"	: [0, 0, 1000,	2200, 3600, 5300 ],
	"defense"	: [0, 0, 0,		0,    0, 	0 	 ],
	"healing"	: [0, 0, 750, 	1750, 2950, 4450 ],
	"hp"		: [0, 0, 500, 	1200, 2100, 3500 ]
};

const equipment_stats = {'hat' : {
//	param			   N	T1		T2		T3		T4		T5		T6
	'attack%' 		: [0,	8, 		13,		18,		25,		30,		35 		],
	'attack' 		: [0,	0, 		0, 		0,		0, 		0,		0 		],
	'defense%' 		: [0,	0, 		0, 		0,		0, 		0,		0 		],
	'defense' 		: [0,	0, 		0, 		0,		0, 		0,		0 		],
	'healing%' 		: [0,	0, 		0, 		0,		0, 		0,		0 		],
	'healing' 		: [0,	0, 		0, 		0,		0, 		0,		0 		],
	'hp%'			: [0,	0, 		0, 		0,		0, 		0,		0 		],
	'hp'			: [0,	0, 		0, 		0,		0, 		0,		0 		],

	'crit_damage' 	: [0,	0, 		0, 		0,		800, 	1200,	1600 	],
	'crit_rate' 	: [0,	0, 		0, 		0,		0, 		0,		0 		],
	'accuracy' 		: [0,	0, 		0, 		0,		0, 		0,		0 		],
	'cc_str'		: [0,	0, 		0, 		0,		0, 		0,		0 		],
	'cc_res'	 	: [0,	0, 		0, 		0,		0, 		0,		0 		],
	'crit_res' 		: [0,	0, 		0, 		0,		0, 		0,		0 		],
	'critdamage_res': [0,	0, 		0, 		0,		0, 		0,		0 		],
	'healing_inc' 	: [0,	0, 		0, 		0,		0, 		0,		0 		],
},

'gloves' : {
	//	param			   N	T1		T2		T3		T4		T5		T6
		'attack'		: [0,	6.4, 	10.4,	14.4,	20,		25,		30 		],
		'crit_rate'	 	: [0,	0, 		0, 		0,		70,		200,	300		],
		'accuracy' 		: [0,	0, 		0, 		0,		0, 		0,		30 		],
	},

'shoes' : {
	//	param			   N	T1		T2		T3		T4		T5		T6
		'attack'		: [0,	4, 		6.5,	9,		12.5,	20,		25 		],
		'hp%'			: [0,	0, 		0, 		0,		6, 		9,		12 		],
	},

'bag' : {
	//	param			   N	T1		T2		T3		T4		T5		T6
		'hp'			: [0,	600,	975,	1350,	1875,	3500,	5500	],
		'defense'		: [0,	0, 		0, 		0,		1000, 	1100,	1200	],
	},

'badge' : {
	//	param			   N	T1		T2		T3		T4		T5		T6
		'hp'			: [0,	800,	1300,	1800,	2500,	4500,	6500	],
		'healing_inc'	: [0,	0, 		0, 		0,		1000, 	2000,	3000	],
		'hp%'			: [0,	0, 		0, 		0,		0,	 	10,		18		],
	},

'hairpin' : {
	//	param			   N	T1		T2		T3		T4		T5		T6
		'hp'			: [0,	400,	650,	950,	1250,	3000,	4500	],
		'cc_res'	 	: [0,	0, 		0, 		0,		10,		20,		24 		],
	},

'charm' : {
	//	param			   N	T1		T2		T3		T4		T5		T6
		'crit_res'		: [0,	80, 	130,	180,	250,	280,	0 		],
		'critdamage_res': [0,	0, 		0, 		0,		1000,	1500,	0 		],
		'crit_rate'		: [0,	0, 		0, 		0,		0,		120,	0 		],
	},

'watch' : {
	//	param			   N	T1		T2		T3		T4		T5		T6
		'crit_rate'		: [0,	80, 	130,	180,	250,	280,	0 		],
		'crit_damage' 	: [0,	0, 		0, 		0,		1000,	1500,	0 		],
		'hp%' 			: [0,	0, 		0, 		0,		0,		5,		0 		],
	},

'necklace' : {
	//	param			   N	T1		T2		T3		T4		T5		T6
		'healing%' 		: [0,	8, 		13, 	18,		25, 	28,		0 		],
		'cc_str' 		: [0,	8, 		13, 	18,		25, 	28,		0 		],
		'attack%' 		: [0,	0, 		0, 		0,		0,		4,		0 		],
	},

};
const equipment_stats_list = Object.keys(equipment_stats.hat);


	
var stats = {};
var equipment = {};
var tableCounter = 0;

	
$( document ).ready(function() {
	initStatCalc();
	$(".stattable-controls input").on("change mouseup keyup click", function(){levelChange($(this).closest("table"));});
	$(".stattable-rarity-selector").children("img").on("click", function(){rarityChange($(this).closest("table"),$(this).attr('data-rarity'));})

	$(".stattable-equipment input").on("change mouseup keyup click", function(){equipmentChange($(this).closest("table"));});
	$(".stattable-equipment").find("img").on("click", function(){equipmentChange($(this).closest("table"),$(this).parent().attr('data-slot'));})
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
		stats[id].cc_str	= parseInt($(this).find(".stat-cc_str").html()) > 0 ? parseInt($(this).find(".stat-cc_str").html()) : null;
		stats[id].cc_res	= parseInt($(this).find(".stat-cc_res").html()) > 0 ? parseInt($(this).find(".stat-cc_res").html()) : null;

		
		//stats[$(this).attr('id')] = JSON.parse($(this).attr('stat-data'));
		if (!hasNull(stats[id])) 
		{
			// Data sanity check to make sure actual raw numbers were provided
			if (fix_ingame_stats && (stats[id].attack_max/stats[id].attack_min < 9))
			{ 
				console.log('StatCalc - Attack data provided is probably NOT a raw number, consider updating data'); 
				fixedStats = calcReverseStat(level_cap,stats[id].rarity,'attack',stats[id].attack_min,stats[id].attack_max);
				stats[id].attack_min = fixedStats[0];
				stats[id].attack_max = fixedStats[1];
			}
			if (fix_ingame_stats && (stats[id].defense_max/stats[id].defense_min < 5.5))
			{ 
				console.log('StatCalc - Defense data provided is probably NOT a raw number, consider updating data'); 
				fixedStats = calcReverseStat(level_cap,stats[id].rarity,'defense',stats[id].defense_min,stats[id].defense_max);
				stats[id].defense_min = fixedStats[0];
				stats[id].defense_max = fixedStats[1];
			}
			if (fix_ingame_stats && (stats[id].hp_max/stats[id].hp_min < 7.4))
			{ 
				console.log('StatCalc - HP data provided is probably NOT a raw number, consider updating data');
				fixedStats = calcReverseStat(level_cap,stats[id].rarity,'hp',stats[id].hp_min,stats[id].hp_max);
				stats[id].hp_min = fixedStats[0];
				stats[id].hp_max = fixedStats[1];
			}
			if (fix_ingame_stats && (stats[id].healing_max/stats[id].healing_min < 2.7))
			{ 
				console.log('StatCalc - Healing data provided is probably NOT a raw number, consider updating data');
				fixedStats = calcReverseStat(level_cap,stats[id].rarity,'healing',stats[id].healing_min,stats[id].healing_max);
				stats[id].healing_min = fixedStats[0];
				stats[id].healing_max = fixedStats[1];
			}
			
			// Character rarity
			raritySelector = $(this).find(".stattable-rarity-selector");
			var star_html = raritySelector.html();
			raritySelector.html(star_html+star_html+star_html+star_html+star_html);		
			raritySelector.children().each(function(index){$(this).attr('data-rarity',index+1)});

			$(this).find(".stattable-controls td").append('<span class="stattable-level-selector">Level: <input class="stattable-level" type="number" value="'+level_cap+'" step="1" min="1" max="100" /></span>'); 
			$(this).find(".stattable-controls").css( "display", "" );	


			// Equipment
			var equipmentTable = $('.character-equipment');
			
			for (let index = 1; index <= 3; index++) {
				equipment[index] = {'type': equipmentTable.find(".equipment-"+index).attr('data-value'), 'image': equipmentTable.find(".equipment-"+index).find("a").html()};
				var max_tier = (index < 3)?6:5;

				$(this).find(".stattable-equipment td").append('<div class="equipment-item equipment-'+index+'" data-type="'+equipment[index].type+'" data-slot="'+index+'">' + equipment[index].image + '<span class="stattable-equipment-tier-selector">Tier: <input class="stattable-tier" type="number" value="'+max_tier+'" step="1" min="1" max="'+max_tier+'" /></span>' + '</div>'); 
			}

			$(this).find(".stattable-equipment").css( "display", "" );
			

			
			equipmentChange($(this));
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
	
	statTableRecalc(statTable.attr('id'));
}	

function equipmentChange (statTable, toggleSlot = false){
	console.log('changing equipment in table '+statTable.attr('id'));

	//console.log(toggleSlot);
	if (toggleSlot) {
		var item_slot = statTable.find(".equipment-"+toggleSlot);
		(item_slot.hasClass("inactive")) ? item_slot.addClass('active').removeClass('inactive') : item_slot.addClass('inactive').removeClass('active');
	}
	
	//var level = !isNaN(parseInt(statTable.find(".stattable-level").val())) ? parseInt(statTable.find(".stattable-level").val()) : 1 ;
	
	//if (level < 1) 	 { statTable.find(".stattable-level").val(1);	level = 1; }
	//if (level > 100) { statTable.find(".stattable-level").val(100); level = 100; }
	
	//stats[statTable.attr('id')].level = level;
	
	statTableRecalc(statTable.attr('id'));
}	
	

function rarityChange (statTable, rarity){
	//console.log('changing RARITY in table '+statTable.attr('id')+' to '+rarity);
	
	stats[statTable.attr('id')].rarity = rarity;
	
	statTable.find(".stattable-rarity-selector").children().each(function(index){ 
		($(this).attr('data-rarity') <= rarity) ? $(this).addClass('active').removeClass('inactive') : $(this).addClass('inactive').removeClass('active');
	});
	
	statTableRecalc(statTable.attr('id'));
}
	

function statTableRecalc(id){
	//console.log(id+' recalc called');
	var statTable = $('#'+id);


	//Equipment
	var equipment_bonus = { };
	equipment_stats_list.forEach(element => {equipment_bonus[element] = 0;});
	

	for (let index = 1; index <= 3; index++) {
		if (!statTable.find(".stattable-equipment .equipment-"+index+"").hasClass("inactive"))
		{
			var eq_type = statTable.find(".stattable-equipment .equipment-"+index+"").attr('data-type');
			var eq_tier = statTable.find(".stattable-equipment .equipment-"+index+" input").val();
			console.log ('Using equipment type ' + eq_type + ' at T' + eq_tier + ' in slot ' + index );

			equipment_stats_list.forEach(element => {
				equipment_bonus[element] += ((typeof equipment_stats[eq_type][element] !== 'undefined' && typeof equipment_stats[eq_type][element][eq_tier] !== 'undefined')?equipment_stats[eq_type][element][eq_tier]:0);
			});

			console.log(equipment_bonus);
		}
	};



	
	statTable.find(".stat-attack").html(totalStat(	stats[id].level, stats[id].rarity, 'attack', 	stats[id].attack_min, stats[id].attack_max, equipment_bonus['attack%'], equipment_bonus['attack'] ));
	statTable.find(".stat-defense").html(totalStat(	stats[id].level, stats[id].rarity, 'defense', 	stats[id].defense_min, stats[id].defense_max, equipment_bonus['defense%'], equipment_bonus['defense']));
	statTable.find(".stat-hp").html(totalStat(		stats[id].level, stats[id].rarity, 'hp', 		stats[id].hp_min, stats[id].hp_max, equipment_bonus['hp%'], equipment_bonus['hp']));
	statTable.find(".stat-healing").html(totalStat(	stats[id].level, stats[id].rarity, 'healing', 	stats[id].healing_min, stats[id].healing_max, equipment_bonus['healing%'], equipment_bonus['healing']));

	statTable.find(".stat-accuracy").html(addBonus( 	stats[id].accuracy,	 	0, 							equipment_bonus['accuracy'] ));
	//statTable.find(".stat-evasion").html(addBonus( 	stats[id].evasion,	 	0, 							0 ));
	statTable.find(".stat-accuracy").html(addBonus( 	stats[id].accuracy,	 	0, 							equipment_bonus['accuracy'] ));
	statTable.find(".stat-crit_rate").html(addBonus( 	stats[id].crit_rate,	0, 							equipment_bonus['crit_rate'] ));
	statTable.find(".stat-crit_damage").html(addBonus( 	stats[id].crit_damage,	0,		 					equipment_bonus['crit_damage'] ));
	//statTable.find(".stat-stability").html(addBonus( 	stats[id].stability,	0, 							0 ));
	statTable.find(".stat-cc_str").html(addBonus( 		stats[id].cc_str,	 	equipment_bonus['cc_str'], 	0 ));
	statTable.find(".stat-cc_res").html(addBonus( 		stats[id].cc_res,	 	equipment_bonus['cc_res'], 	0 ));



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
	return Math.ceil( (val1 + (val100 - val1) * (level - 1) / 99) * (10000 + rarity_bonus[statName][rarity]) / 10000 );
}
	
	
function calcReverseStat(startingLevel,startingRarity,statName,val1,val100){
	var rawVal1 = val1 / (10000 + rarity_bonus[statName][startingRarity]) * 10000;
	var rawVal100 = (val100 / (10000 + rarity_bonus[statName][startingRarity]) * 10000 - rawVal1) / (startingLevel - 1) * 99 + rawVal1;
	
	return [Math.floor(rawVal1), Math.floor(rawVal100)];
}	
	
	
function hasNull(target) {
    for (var member in target) {
        if (target[member] == null)
            return true;
    }
    return false;
}
/* Character stat calc - end */	