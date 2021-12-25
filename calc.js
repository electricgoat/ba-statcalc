/* Character stat calc - start */
const level_cap = 75;
const fix_ingame_stats = true; //attempt to recalculate raw numbers if provided data looks like ingame stats

const rarity_bonus = {
	"attack"	: [0, 0, 1000,	2200, 3600, 5300 ],
	"defense"	: [0, 0, 0,		0,    0, 	0 	 ],
	"healing"	: [0, 0, 750, 	1750, 2950, 4450 ],
	"hp"		: [0, 0, 500, 	1200, 2100, 3500 ]
};
	
var stats = {};
var tableCounter = 0;

	
$( document ).ready(function() {
	initStatCalc();
	$(".stattable-controls input").on("change mouseup keyup click", function(){levelChange($(this).closest("table"));});
	$(".stattable-rarity-selector").children("img").on("click", function(){rarityChange($(this).closest("table"),$(this).attr('data-rarity'));})
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
			
			
			raritySelector = $(this).find(".stattable-rarity-selector");
			var star_html = raritySelector.html();
			raritySelector.html(star_html+star_html+star_html+star_html+star_html);		
			raritySelector.children().each(function(index){$(this).attr('data-rarity',index+1)})
			
			$(this).find(".stattable-controls td").append('<span class="stattable-level-selector">Level: <input class="stattable-level" type="number" value="'+level_cap+'" step="1" min="1" max="100" /></span>'); 
			
			$(this).find(".stattable-controls").css( "display", "" );	
			
			rarityChange($(this), stats[id].rarity);
			//statTableRecalc(id);
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
	
	statTable.find(".stat-attack").html(calcStat(	stats[id].level, stats[id].rarity, 'attack', 	stats[id].attack_min, stats[id].attack_max));
	statTable.find(".stat-defense").html(calcStat(	stats[id].level, stats[id].rarity, 'defense', 	stats[id].defense_min, stats[id].defense_max));
	statTable.find(".stat-hp").html(calcStat(		stats[id].level, stats[id].rarity, 'hp', 		stats[id].hp_min, stats[id].hp_max));
	statTable.find(".stat-healing").html(calcStat(	stats[id].level, stats[id].rarity, 'healing', 	stats[id].healing_min, stats[id].healing_max));
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