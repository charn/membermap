/*jslint browser: true*/
/*global L */

(function (window, document, L, undefined) {
  'use strict';

  L.Icon.Default.imagePath = 'images/';

  var map = L.map('map', {
    center: [64.9514, 27.6023],
    zoom: 5
  });

  new L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
  //new L.tileLayer('http://a.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
    minZoom: 0,
    maxZoom: 18,
    //attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
    attribution: '<a href="http://maps.stamen.com">Map tiles</a> by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
  }).addTo(map);

  var USE_LOG = true;
  var LOG_BOOST = 1;

  // FIXME: Why do I need to do this to silence gulp?
  var $ = window.$;

  /** Find the amount of members in the most popular municipality. */
  var findMaximumMembers = function(matched) {
    var maxMembers = -Infinity;
    for (var loc in matched) {
      if (matched.hasOwnProperty(loc)) {
        var members = matched[loc];
        if (members > maxMembers) {
          maxMembers = members;
        }
      }
    }
    return maxMembers;
  };

  /** Count members in each location. */
  var binMembers = function(members) {
    var locations = {};
    var totalMembers = members.length;
    for (var i = 0; i < totalMembers; ++i) {
      var member = members[i];
      var loc = member.residence.toLowerCase().trim();
      if (locations[loc]) {
        locations[loc] += 1;
      } else {
        locations[loc] = 1;
      }
    }
    return {
      'locations': locations,
      'totalMembers': totalMembers
    };
  };

  /** Match Finnish and Swedish names into one bin. */
  var matchWithFeatures = function(locations, municipalities) {
    var features = municipalities.features;
    var featureLength = features.length;
    var matched = {};

    for (var i = 0; i < featureLength; ++i) {
      var feature = features[i];
      var names = feature.properties.text;
      var firstName = names[0];
      var nameAmount = names.length;
      for (var j = 0; j < nameAmount; ++j) {
        var name = names[j].toLowerCase().trim();
        if (locations[name]) {
          if (matched[firstName]) {
            matched[firstName] += locations[name];
          } else {
            matched[firstName] = locations[name];
          }
        }
      }
    }

    return matched;
  };

  var cloneSimpleObject = function(obj) {
    return JSON.parse(JSON.stringify(obj));
  };

  /** Add .amount and .relativeAmount for Leaflet visualization. */
  var augmentFeatures = function(matched, municipalities) {
    var augmented = cloneSimpleObject(municipalities);
    var featureLength = augmented.features.length;
    var maxMembers = findMaximumMembers(matched);
    var logDivisor = Math.log(maxMembers) + LOG_BOOST;
    var i;

    for (i = 0; i < featureLength; ++i) {
      var firstName = augmented.features[i].properties.text[0];
      var members = matched[firstName];
      if (members) {
        augmented.features[i].properties.amount = members;
        if (USE_LOG) {
          augmented.features[i].properties.relativeAmount =
            (Math.log(members) + LOG_BOOST) / logDivisor;
        } else {
          augmented.features[i].properties.relativeAmount =
            members / maxMembers;
        }
      } else {
        augmented.features[i].properties.amount = 0;
        augmented.features[i].properties.relativeAmount = 0;
      }
    }
    return augmented;
  };

  /** Choose how to visualize member density. */
  var createLeafletGeoJson = function(map, augmented, totalMembers) {
    return L.geoJson(augmented, {
        style: function (feature) {
          return {
            stroke: false,
            color: 'black',
            weight: 1,
            opacity: 1,
            fill: true,
            fillColor: 'red',
            fillOpacity: feature.properties.relativeAmount
          };
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(feature.properties.text[0] + ': ' +
                          feature.properties.amount + '/' + totalMembers);
        }
      });
  };

  $.getJSON('./data/located_members.json')
    .then(function(members) {
      var binned = binMembers(members);
      var locations = binned.locations;
      var totalMembers = binned.totalMembers;

      $.getJSON('./data/kuntarajat.geojson')
        .then(function(municipalities) {
          var matched = matchWithFeatures(locations, municipalities);
          var augmented = augmentFeatures(matched, municipalities);
          var leafletGeoJson = createLeafletGeoJson(map, augmented,
                                                    totalMembers);
          leafletGeoJson.addTo(map);
        });
    });

}(window, document, L));
