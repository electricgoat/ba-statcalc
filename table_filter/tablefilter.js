// Internal filter array
let tableFilters = [];
let quickFilter = {}; // Groups that have quick filter buttons
let lastSearchSegments = [];

// Initial table sortlists, fist value should be the date column index
const initSortList = {
    'charactertable': [{14: "desc"}, {2: "desc"}, {1: "asc"}],
    'bannertable': [{2: "desc"}, {0: "asc"}],
}

// Map keywords to button groups/values
const search_keywords = {
    'charactertable' : {
        'gehenna': { group: 'school', value: 'gehenna' },
        'trinity': { group: 'school', value: 'trinity' },
        'valkyrie': { group: 'school', value: 'valkyrie' },
        'highlander': { group: 'school', value: 'highlander' },
        'wildhunt': { group: 'school', value: 'wildhunt' },
        'abydos': { group: 'school', value: 'abydos' },
        'arius': { group: 'school', value: 'arius' },
        'millennium': { group: 'school', value: 'millennium' },
        'red_winter': { group: 'school', value: 'red_winter' },
        'srt': { group: 'school', value: 'srt' },
        'etc': { group: 'school', value: 'etc' },

        'ar': { group: 'weapon', value: 'ar' },
        'ft': { group: 'weapon', value: 'ft' },
        'gl': { group: 'weapon', value: 'gl' },
        'hg': { group: 'weapon', value: 'hg' },
        'mg': { group: 'weapon', value: 'mg' },
        'rg': { group: 'weapon', value: 'rg' },
        'rl': { group: 'weapon', value: 'rl' },
        'sg': { group: 'weapon', value: 'sg' },
        'smg': { group: 'weapon', value: 'smg' },
        'sr': { group: 'weapon', value: 'sr' },

        'front': { group: 'position', value: 'front' },
        'middle': { group: 'position', value: 'middle' },
        'back': { group: 'position', value: 'back' },

        'attacker': { group: 'role', value: 'attacker' },
        'tank': { group: 'role', value: 'tank' },
        'tanker': { group: 'role', value: 'tank' },
        'healer': { group: 'role', value: 'healer' },
        'support': { group: 'role', value: 'support' },
        'tacticalsupport': { group: 'role', value: 'ts' },
        'ts': { group: 'role', value: 'ts' },
        't.s': { group: 'role', value: 'ts' },
        't.s.': { group: 'role', value: 'ts' },

        'striker': { group: 'class', value: 'striker' },
        'special': { group: 'class', value: 'special' },

        'explosive': { group: 'attack', value: 'explosive' },
        'red': { group: 'attack', value: 'explosive' },
        'mystic': { group: 'attack', value: 'mystic' },
        'blue': { group: 'attack', value: 'mystic' },
        'penetration': { group: 'attack', value: 'penetration' },
        'piercing': { group: 'attack', value: 'penetration' },
        'yellow': { group: 'attack', value: 'penetration' },
        'sonic': { group: 'attack', value: 'sonic' },
        'purple': { group: 'attack', value: 'sonic' },

        'light': { group: 'armor', value: 'light' },
        'heavy': { group: 'armor', value: 'heavy' },
        'specialarmor': { group: 'armor', value: 'special' },
        'elastic': { group: 'armor', value: 'elastic' },

        // Text search keywords
        'ᓀ‸ᓂ': { text: '"azusa"' },
        '`‸´': { text: '"kasumi"' }, //'-`‸´-': { text: 'kasumi' },
        '눈': { text: '"fuuka"' }, //'눈_눈': { text: 'fuuka' },
        '囧': { text: '"koyuki"' },
        'sexy': { text: '"seia"' },
    },
    'bannertable': {
        'gl': { group: 'server', value: 'gl' },
        'global': { group: 'server', value: 'gl' },
        'jp': { group: 'server', value: 'jp' },
        'japan': { group: 'server', value: 'jp' },

        'regular': { group: 'type', value: 'pickupgacha' },
        'normal': { group: 'type', value: 'pickupgacha' },
        'common': { group: 'type', value: 'pickupgacha' },
        'limited': { group: 'type', value: 'limitedgacha' },
        'unique': { group: 'type', value: 'limitedgacha' },
        'anni': { group: 'type', value: 'fesgacha' },
        'anniversary': { group: 'type', value: 'fesgacha' },
        'fes': { group: 'type', value: 'fesgacha' },
        'fest': { group: 'type', value: 'fesgacha' },

        'new': { group: 'release', value: 'new' },
        'rerun': { group: 'release', value: 'rerun' },
        'reprint': { group: 'release', value: 'rerun' },
        'copy': { group: 'release', value: 'rerun' },

        // Text search keywords
        'ᓀ‸ᓂ': { text: '"azusa"' },
        '`‸´': { text: '"kasumi"' }, //'-`‸´-': { text: 'kasumi' },
        '눈': { text: '"fuuka"' }, //'눈_눈': { text: 'fuuka' },
        '囧': { text: '"koyuki"' },
        'sexy': { text: '"seia"' },
    },
    
};


$(document).ready(function() {
    initTableFilters();
    updateFiltersUI();
    lastSearchSegments = $("#table-search").val().toLowerCase().split(/[\s_,;+\-]+/).filter(seg => seg.length >= 2);
});


function initTableFilters() {
    const filter = $("#table-filter");
    filterTarget = filter.data('target') !== undefined ? filter.data('target') : 'charactertable'; //global
    textSearchCellIndex = filter.data('search-cell-index') !== undefined ? filter.data('search-cell-index') : 1; //global

    quickFilter.groups = new Set();
    quickFilter.filters = {};

    let initialFilters = [];

    $(".controls-search").html(
        $('<input>', {
            type: 'text',
            id: 'table-search',
            placeholder: 'Filter...',
        })
    );
    
    $.each(filter.find('div.controls > span'), function() {
        //var toggle = $(this).attr('data-toggle');
        const [group, value] = $(this).attr('data-toggle').split('-');
        //console.log('Quick filter button:', group, value);
        if (typeof(group) !== 'undefined') {
            quickFilter.groups.add(group);
            if (!quickFilter.filters.hasOwnProperty(group)) quickFilter.filters[group] = new Set();
            quickFilter.filters[group].add(value);
        } 

        if ($(this).hasClass('active') && window.location.hash.length === 0) {
            initialFilters.push({type: 'param', src: 'quickfilter', group, value});
        }
    });


    
    if (window.location.hash.length > 1) {
        const uri = decodeURIComponent(window.location.hash.substring(1));
        const segments = new Set(uri.split('_')); //.filter(seg => seg.length >= 2);
        for (let seg of segments) {
            seg = seg.replace(/^-+|-+$/g, '');
            if (search_keywords[filterTarget].hasOwnProperty(seg)) {
                if (search_keywords[filterTarget][seg].hasOwnProperty('text')) {
                    initialFilters.push({type: 'text', src: 'textfield', value: search_keywords[filterTarget][seg].text});
                } else {
                    const {group, value} = search_keywords[filterTarget][seg];
                    const is_quickfilter = quickFilter.groups.has(group);
                    initialFilters.push({type: 'param', src: is_quickfilter?'quickfilter':'textfield', group, value});
                }
            } else if (seg.includes('-')) {
                const [group, value] = seg.split('-');
                const is_quickfilter = quickFilter.groups.has(group);
                initialFilters.push({type: 'param', src: is_quickfilter?'quickfilter':'textfield', group, value});
            } else {
                initialFilters.push({type: 'text', src:'textfield', value: seg});
            }
        }
    }
    tableFilters = initialFilters;


    // Event handlers
    filter.find("div.controls > span").addClass('inactive').on("click", function() { tableFilterToggle($(this)); });
    $("#table-search").on("input", function() {tableTextFilter($(this).val()); });


    // Sync button states
    $("#table-filter div.controls > span").each(function() {
        const toggle = $(this).attr('data-toggle');
        const [group, value] = toggle.split('-');
        const active = tableFilters.some(f => f.type === 'param' && f.group === group && f.value === value);
        $(this).toggleClass('active', active).toggleClass('inactive', !active);
    });
}


function tableFilterToggle(toggleItem) {
    const toggle = $(toggleItem).attr('data-toggle');
    const [group, value] = toggle.split('-');

    // Remove any existing filter for this group/value
    tableFilters = tableFilters.filter(f => !((f.type === 'param' || f.type === 'keyword') && f.src === 'quickfilter' && f.group === group && f.value === value));
    if (toggleItem.hasClass("inactive")) {
        //console.log('Adding filter', {type: 'param', group, value});
        toggleItem.addClass('active').removeClass('inactive');
        tableFilters.push({type: 'param', src: 'quickfilter', group, value});
    } else {
        //console.log('Removing filter', {type: 'param', group, value});
        toggleItem.addClass('inactive').removeClass('active');
        // Already removed above
    }
    updateFiltersUI();
}


function tableTextFilter(searchStr) {
    const segments = searchStr.toLowerCase().split(/[\s_,;+\-]+/); //.filter(seg => seg.length >= 2);
    // Only update if segments changed
    if (segments.join('|') === lastSearchSegments.join('|')) {
        //console.log('Offramp: No change in search segments \n' + segments.join('|') + '\n' + lastSearchSegments.join('|'));
        return;
    }
    lastSearchSegments = segments;

    // Remove all previous textfield filters from array, readd new ones
    tableFilters = tableFilters.filter(f => f.src !== 'textfield');

    for (const seg of segments) {
        if (search_keywords[filterTarget].hasOwnProperty(seg)) {
            //console.log('Keyword match:', seg, search_keywords[filterTarget][seg]);
            if (search_keywords[filterTarget][seg].hasOwnProperty('text')) {
                //console.log('Adding text filter:', search_keywords[filterTarget][seg].text);
                tableFilters.push({type: 'text', src: 'textfield', value: search_keywords[filterTarget][seg].text});
            } else {
                //console.log('Adding param filter:', search_keywords[filterTarget][seg]);
                const {group, value} = search_keywords[filterTarget][seg];
                const is_quickfilter = quickFilter.groups.has(group);
                tableFilters.push({type: 'param', src: is_quickfilter?'quickfilter':'textfield', group, value});
            }
        } else if (seg.length > 2 && seg.includes(':')) {
            const [group, value] = seg.split(':');
            const is_quickfilter = quickFilter.groups.has(group);
            if (quickFilter.groups.has(group) && quickFilter.filters[group].has(value)) {
                //console.log('Adding quickfilter param filter:', {group, value});
                tableFilters.push({type: 'param', src: is_quickfilter?'quickfilter':'textfield', group, value});
            } else if (quickFilter.groups.has(group)) {
                // Do nothing, wait for valid quickfilter value for this group
            }
            else {
                //console.log('Adding textfield param filter:', {group, value});
                tableFilters.push({type: 'param', src: 'textfield', group, value});
            }
        } else if (seg.length > 2) {
            tableFilters.push({type: 'text', src: 'textfield', value: seg});
        }
    }

    
    // Sync button states
    $("#table-filter div.controls > span").each(function() {
        const toggle = $(this).attr('data-toggle');
        const [group, value] = toggle.split('-');
        const active = tableFilters.some(f => f.src === 'quickfilter' && f.group === group && f.value === value);
        $(this).toggleClass('active', active).toggleClass('inactive', !active);
    });

    updateFiltersUI();
}


// Update UI and filtering
function updateFiltersUI() {
    const $table = $("#"+filterTarget);

    // Update text field (only param/text filters) IF not focused
    const $search = $("#table-search");
    if (!$search.is(":focus")) {
        $search.val(filtersToTextField(tableFilters));
    }

    // Apply filtering to table
    $table.find("tr").each(function () {
        if ($(this).closest('thead').length) return;
        let showRow = true;
        const textSearchCell = $(this).find("td").eq(textSearchCellIndex);

        // Collect all filters by group
        const filteredGroups = {};
        for (const f of tableFilters) {
            if (f.type === 'param' || f.type === 'keyword') {
                if (!filteredGroups[f.group]) filteredGroups[f.group] = new Set();
                filteredGroups[f.group].add(f.value);
            }
        }
        
        // Check param filters (additive within group)
        for (const group in filteredGroups) {
            if (!matchConditional(this, group, filteredGroups[group])) {
                showRow = false;
                break;
            }
        }

        // Check text filters
        if (showRow) {
            for (const f of tableFilters) {
                if (f.type === 'text') {
                    if (!textSearchCell.length) {
                        showRow = false;
                        break;
                    }
                    const cellText = textSearchCell.text().toLowerCase();
                    if (f.value.startsWith('"') && f.value.endsWith('"')) {
                        // Whole-word match for quoted text
                        const quoted = f.value.slice(1, -1).toLowerCase();
                        // Use word boundaries for whole word match
                        const regex = new RegExp(`\\b${quoted}\\b`, 'i');
                        if (!regex.test(cellText)) {
                            showRow = false;
                            break;
                        }
                    } else {
                        // Partial match for normal text
                        if (cellText.indexOf(f.value) === -1) {
                            showRow = false;
                            break;
                        }
                    }
                }

            }
        }

        $(this).toggleClass('visible', showRow).toggleClass('hidden', !showRow);
    });

    $table.trigger("sortEnd.tablesorter");

    // Update URL anchor
    window.location.hash = encodeURIComponent(filtersToURI(tableFilters));
}


function matchConditional(row, key, values) {
    // Support values as a Set, Array, or single string
    let valueList = Array.isArray(values) ? values : (values instanceof Set ? Array.from(values) : [values]);

    const rowVal = $(row).data(key);
    if (rowVal === undefined) return true;

    // Check each value in the list
    for (let val of valueList) {
        let op = null, cmpVal = val;
        if (typeof val === 'string') {
            if (val.startsWith('>=')) { op = '>='; cmpVal = val.slice(2); }
            else if (val.startsWith('<=')) { op = '<='; cmpVal = val.slice(2); }
            else if (val.startsWith('>')) { op = '>'; cmpVal = val.slice(1); }
            else if (val.startsWith('<')) { op = '<'; cmpVal = val.slice(1); }
        }

        // Numeric compare
        if (op && !isNaN(cmpVal) && !isNaN(rowVal)) {
            const nRow = Number(rowVal), nVal = Number(cmpVal);
            if (op === '>' && nRow > nVal) return true;
            if (op === '>=' && nRow >= nVal) return true;
            if (op === '<' && nRow < nVal) return true;
            if (op === '<=' && nRow <= nVal) return true;
            if (!op && nRow === nVal) return true;
        }
        // Affinity compare (urban, outdoors, indoors)
        else if (['urban','outdoors','indoors'].includes(key) && op) {
            if (affinityCompare(rowVal, op, cmpVal)) return true;
        }
        // Default: string match
        else if (String(rowVal).toLowerCase() === String(cmpVal).toLowerCase()) {
            return true;
        }
    }
    return false;
}


// Helper for affinity letter order
const affinityOrder = ['d','c','b','a','s','ss'];
function affinityCompare(rowVal, op, val) {
    const rowIdx = affinityOrder.indexOf(rowVal.toLowerCase());
    const valIdx = affinityOrder.indexOf(val.toLowerCase());
    if (rowIdx === -1 || valIdx === -1) return false;
    if (op === '>') return rowIdx > valIdx;
    if (op === '>=') return rowIdx >= valIdx;
    if (op === '<') return rowIdx < valIdx;z
    if (op === '<=') return rowIdx <= valIdx;
    return rowIdx === valIdx;
}

// Utility: convert filter array to URI string
function filtersToURI(filters) {
    return filters.map(f => {
        if (f.type === 'keyword') return f.value;
        if (f.type === 'param') return `${f.group}-${f.value}`;
        if (f.type === 'text') return f.value;
    }).join('_');
}

// Utility: convert filter array to text field string (only param/text filters)
function filtersToTextField(filters) {
    //console.log(filters);
    return filters.filter(f => f.src === 'textfield').map(f => {
        if (f.type === 'keyword') return f.value;
        if (f.type === 'param') return `${f.group}:${f.value}`;
        if (f.type === 'text') return f.value;
    }).join(' ');
}

// Utility: parse text field into param/text filters
function parseTextField(str) {
    const segments = str.toLowerCase().split(/[\s_,;+]+/).filter(seg => seg.length >= 2);
    return segments
        .filter(seg => {
            // Only allow text search segments with length >= 3, or param segments
            if (seg.includes(':')) return true;
            return seg.length >= 3;
        })
        .map(seg => {
            if (seg.includes(':')) {
                const [group, value] = seg.split(':');
                return {type: 'param', group, value};
            }
            return {type: 'text', value: seg};
        });
}



///
/// Release cutoff line
///
$(document).ready(function () {
    const $table = $("#"+filterTarget);

    //TODO
    // console.log('Setting initial sortlist ' + initSortList[filterTarget]);
    // mw.loader.using("jquery.tablesorter", function() {
    //         $("table.sortable").tablesorter({sortList: [{2: "desc"}, {1: "asc"}]});
    //     });

    $table.on("sortEnd.tablesorter", function () {
            const config = $table.data("tablesorter").config;
            const sortList = config.sortList;

            if (sortList.length >= 1 && sortList[0][0] === Number(Object.keys(initSortList[filterTarget][0])[0]) && sortList[0][1] < 2) {
                addCutoffClass($table, sortList[0][1]);
            } else {
                $table.find("tr.global-line").removeClass("global-line line-top line-bottom");
            }
        });

    // Trigger initial calculation
    $table.trigger("sortEnd.tablesorter");


});

function addCutoffClass($table, sortDirection) {
    const isAscending = sortDirection === 0;

    const now = new Date();
    const jstNow = new Date(
        now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60000
    );
    const cutoffDate = new Date(
        jstNow.getFullYear(),
        jstNow.getMonth(),
        jstNow.getDate(),
        11, 0, 0
    ).getTime();

    const $rows = $table.find("tbody tr.visible");
    let cutoffIndex = -1;

    $rows.each(function (index) {
        const $row = $(this);
        const dateAttr = $row.attr("data-releasedate-gl");

        if (!dateAttr) {
            // Missing date is treated as future (ASC) or skip (DESC)
            if (isAscending) cutoffIndex = index;
            return cutoffIndex >= 0 ? false : true;
        }

        const releaseTime = new Date(dateAttr.replace(/\//g, "-")).getTime();
        if (isNaN(releaseTime)) {
            if (isAscending) cutoffIndex = index;
            return cutoffIndex >= 0 ? false : true;
        }

        if (isAscending) {
            if (releaseTime > cutoffDate) {
                cutoffIndex = index;
                return false;
            }
        } else {
            if (releaseTime <= cutoffDate) {
                cutoffIndex = index - 1;
                return false;
            }
        }
    });

    //console.log('Cutoff index is '+cutoffIndex);
    $table.find("tr.global-line").removeClass("global-line line-top line-bottom");
    if (cutoffIndex >= 0 && cutoffIndex < $rows.length) {
        $rows.eq(cutoffIndex)
            .addClass("global-line")
            .addClass(isAscending ? "line-top" : "line-bottom");
    }
}
