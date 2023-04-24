var charactertable_filter = [];
$( document ).ready(function() {
    initCharacterTableFilters();
});

function initCharacterTableFilters() {
    var filter = $("#charactertable-filter");

    charactertable_filter.groups = {};
    charactertable_filter.filters = {};

    $.each(filter.find('div.controls > span'), function() {
        var toggle = $(this).attr('data-toggle');
        if (typeof(charactertable_filter.filters[toggle.split('-',1)[0]]) == 'undefined') charactertable_filter.filters[toggle.split('-',1)[0]] = {};

        charactertable_filter.groups[toggle.split('-',1)[0]] = false;
        charactertable_filter.filters[toggle.split('-',1)[0]][toggle] = false;
    });

    filter.find("div.controls > span").addClass('inactive').on("click", function(){characterTableToggle($(this));});
}


function updateCharacterTableFilterGroups () {
    Object.keys(charactertable_filter.groups).forEach(group => {
        //Filter isn't applied if ALL group elements are in the same state (either on or off) 
        if (Object.values(charactertable_filter.filters[group]).every(element => element === true) 
         || Object.values(charactertable_filter.filters[group]).every(element => element === false)) {
            charactertable_filter.groups[group] = false;
        }
        else {
            charactertable_filter.groups[group] = true;
        }
    });
}


function applyCharacterTableFilter () {

    $(".charactertable tr").each(function (){
        var hideRow = false;
        Object.keys(charactertable_filter.groups).forEach(group => {
            if (charactertable_filter.groups[group] === true) {
                Object.keys(charactertable_filter.filters[group]).forEach(filter => {
                    if (charactertable_filter.filters[group][filter] === false && $(this).hasClass(filter)) hideRow = true;
                });
            }
        });
        
        if (hideRow) $(this).addClass('hidden').removeClass('visible');
        else $(this).addClass('visible').removeClass('hidden');
    });
}


function characterTableToggle (toggleItem = false) {
	//console.log('toggling '+toggleItem.attr('data-toggle'));
	//toggleItem = (typeof toggleItem !== 'undefined') ? toggleItem : false; //default false, ES5 does not support function defaults

	if (toggleItem) {
        var toggle = $(toggleItem).attr('data-toggle');

		if (toggleItem.hasClass("inactive")) {
			toggleItem.addClass('active').removeClass('inactive');
            charactertable_filter.filters[toggle.split('-',1)[0]][toggle] = true;
            //console.log(`Toggled ON filter ${toggle.split('-',1)[0]}.${toggle}`);
		}
		else {
			toggleItem.addClass('inactive').removeClass('active');
            charactertable_filter.filters[toggle.split('-',1)[0]][toggle] = false;
            //console.log(`Toggled OFF filter ${toggle.split('-',1)[0]}.${toggle}`);
		}

        updateCharacterTableFilterGroups();
        applyCharacterTableFilter();
	}
}