var IV_FILTER_VALUE = 96;
/* The following updates the HTML if not present */
if($('#iv_filter_container').length == 0){
	$HTML = '<div id="iv_filter_container" style="font-size: 15px; padding: 0 90px 10px 10px;">';
	$HTML += '<p>Filter Pokemons with IV greater than:</p>'
	$HTML += '<select id="IV_FILTER_VALUE">\n';
	$HTML += '<option value="" disabled="disabled">Select IV value</option>';
	for( i = 100; i >= 0; i--){
		$HTML += '<option value="'+i+'" ' + (i==IV_FILTER_VALUE ? 'selected="selected">' : '>') + i + '% IV</option>\n';
	} 
	$HTML += '</select>\n';
	$HTML += '</div>';
	$('#select_all').after($HTML);
}

/* New functions */
function getIVFilter(){
	return IV_FILTER_VALUE;
};
function setIVFilter(){
	IV_FILTER_VALUE = parseInt($('#IV_FILTER_VALUE').val());
	console.log("IV_FILTER_VALUE changed to %s", IV_FILTER_VALUE);
};
$('#IV_FILTER_VALUE').on('change', function(){
	setIVFilter();
    forceReloadPokemons();
});

/* forceReloadPokemons */
function forceReloadPokemons() {
	var $checkedMons = [];
	// store checked mons
	$(".filter_checkbox input:checked").each(function(){
		$checkedMons.push($(this));
	});
	// remove all mons
	for (var key in pokeDict) {
		uncheckPokemon(key);
	};
  	inserted = 0;
	processNewPokemons({});
	// Add back pokemon
	$($checkedMons).each(function(){
        var tmpPokemon = pokeDict[this.val()];
        if (tmpPokemon['show_filter']) {
          $(this).prop('checked', true);
          checkPokemon($(this).val());
        }          
	});
	var mons = '&mons=';
  	
  	for (var i in pokeDict) {
    	if (isPokemonChecked(i) || shouldTurnFilterOff()) {
      	mons += i + ',';
    	}
  	}
  	
  	mons = mons.slice(0, -1);
  	  
  	var doneFunction = function(data) {
  		//console.log(">>>>> data is:");
  		//console.log(data);
    	var newPokemons = data['pokemons'];
    	var meta = data['meta'];
    	    
    	timeOffset = Math.floor(Date.now() / 1000) - parseInt(meta['time']);
  	  	processNewPokemons(newPokemons);
  	  	reloadPokemons();
  	}
  
	$.ajax({
		type: 'GET',
		url: 'query2.php?since='+ inserted + mons
	}).done(doneFunction);

};


/* New version of processNewPokemons */
function processNewPokemons(newPokemons) {
  var shouldHide = true;
  if (map.getZoom() >= 14 || (markers.length + newPokemons.length) <= 15) {
    // shouldHide = false;
  }
  
  for (var i = 0; i < newPokemons.length; ++i) {
    if (!newPokemons[i]['disguise']) {
      newPokemons[i]['disguise'] = 0;
    }
    
    if (!newPokemons[i]['attack']) {
      newPokemons[i]['attack'] = -1;
    }
    
    if (!newPokemons[i]['defence']) {
      newPokemons[i]['defence'] = -1;
    }
    
    if (!newPokemons[i]['stamina']) {
      newPokemons[i]['stamina'] = -1;
    }
    
    if (!newPokemons[i]['move1']) {
      newPokemons[i]['move1'] = -1;
    }
    
    if (!newPokemons[i]['move2']) {
      newPokemons[i]['move2'] = -1;
    }
    
    var pokemon = new Pokemon(newPokemons[i]['pokemon_id'], new Point(newPokemons[i]['lat'], newPokemons[i]['lng']), newPokemons[i]['despawn'], newPokemons[i]['disguise'], newPokemons[i]['attack'], newPokemons[i]['defence'], newPokemons[i]['stamina'], newPokemons[i]['move1'], newPokemons[i]['move2']);
    var currentUnixTime = Math.floor(Date.now() / 1000) - timeOffset;
    
    var isIV = (parseInt(newPokemons[i]['attack'])+parseInt(newPokemons[i]['defence'])+parseInt(newPokemons[i]['stamina']))/45*100 >= IV_FILTER_VALUE;
        
    if (currentUnixTime < pokemon.despawn && isIV) {
      var index = indexOfPokemons(pokemon, pokemons);
      if (index == -1) {
        pokemons.push(pokemon);        
        
        var markerLocation = new L.LatLng(pokemon.center.lat, pokemon.center.lng);

        var iconDimension = 36;
        var iconOptions = {
          iconSize: [iconDimension, iconDimension],
          iconAnchor: [iconDimension/2, iconDimension],
          popupAnchor: [0, -iconDimension],
          zIndexOffset: -1000,
          html : pokeHTML(pokemon, shouldHide)
        }
        var htmlIcon = new L.HtmlIcon(iconOptions);

        var marker = new L.Marker(markerLocation, {icon: htmlIcon});
        if (isPokemonChecked(pokemon.id) || shouldTurnFilterOff()) {
          marker.addTo(map);
        }
        
        marker.bindPopup("");
        markers.push(marker);
        marker.addEventListener('click', function(e) {
          selectedMarker = e.target;
          var index = -1;
          for (var i = 0; i < markers.length; ++i) {
            if (markers[i] == selectedMarker) {
              index = i;
              break;
            }
          }
          if (index != -1) {
            selectedMarker.bindPopup(infoWindowString(pokemons[index]));
          }
        });
        
        if (parseFloat(newPokemons[i]['lat']) == hashPokemonLat && parseFloat(newPokemons[i]['lng']) == hashPokemonLng) {
          hashPokemonLat = 0;
          hashPokemonLng = 0;
          selectedMarker = marker;
          selectedMarker.bindPopup(infoWindowString(pokemon));
          selectedMarker.openPopup();
        }
      }
    }
  }
  refreshPokemons();
}

/* only if run as stand alone */
forceReloadPokemons();