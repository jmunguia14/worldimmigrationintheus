// *************************//
 // CODE FOR INTERACTION     //
// **********************   //

// associate array with state keys and each value 
// is an array of {country, value} associative arrays
var countryData = {};
// associative array with country keys and each value
// is an array of {state, value} associative arrays
var stateData = {};


var gist_url = "https://cdn.rawgit.com/jmunguia14/154e0ff30de06f5d3899216039de7ef4/raw/3dcccd6d1013f226b8569a83006608492ce189d0/STATE-COUNTRY.txt"
d3.csv(gist_url, function(data) {

// ***** ALL CODE INSIDE THE 3D FUNCTION *****  //
  data = data.slice(1);
  data = data.map(function(d) {
    var cleanD = {};
    d3.keys(d).forEach(function(k) {
      cleanD[_.trim(k)] = _.trim(d[k]);
    });
    return cleanD;
  });

  // Read the columns into the data array
  var states = data.map(function(d) {
    return d.Geography;
  });
  var countries = d3.keys(data[0]);
  stateData = d3.nest()
    .key(function(d) {
      return d.Geography;
    })
    .rollup(function(v) {
      return d3.entries(v[0]).map(function(d) { return {country: d.key, value: d.value}; });
    })
    .object(data);
  countryData = countries.map(function(d) {
    return {
      country: d,
      value: data.map(function(dd) {
        return {
          state: dd.Geography,
     
value: +dd[d]
        };
      })
    }
  });
  countryData = d3.nest()
    .key(function(d) {
      return d.country;
    })
    .rollup(function(v) {
      return v[0].value;
    })
    .object(countryData);

	// Look in the console to see what this data looks like
 console.log(stateData);
  console.log(countryData);
  console.log(stateData["Massachusetts"]);
  console.log(countryData["El Salvador"]);






// CODE TO LOAD MAPS //

/// WORLD MAP CODE // 


    // Initiate the chart
    var worldMap = Highcharts.mapChart('container', {


        title: {

            text: 'Immigrants to the United States'
            
        },
       

        legend: {
            title: {
                text: 'Immigrants To The United States',
                floating: true,
                style: {
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black',
                    
                }
            }
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        tooltip: {
            backgroundColor: 'none',
            borderWidth: 0,
            shadow: false,
            useHTML: true,
            padding: 0,
            pointFormat: '<span class="f32"><span class="flag {point.flag}">' +
                '</span><span> {point.name}<br>' +
                '<span style="font-size:30px">{point.value}</span>',
            positioner: function () {
                return { x: 0, y: 250 };
            }
        },

        colorAxis: {
            min: 1,
            max: 10000000,
            type: 'logarithmic'
        },

        series: [{
        // region stays selected
        allowPointSelect: true,
         cursor: 'pointer',
         states: {
                select: {
                    color: '#a4edba',
                    borderColor: 'black',
                    dashStyle: 'shortdot'
                }
            },
            data:stateData["TotalCountry"],
            mapData: Highcharts.maps['custom/world'],
            // iso-a2
            joinBy: ['name', 'country'],
            events: {
                click: function (event) {
            			// event.point.name is the name of the state/country
            			filterByCountry(event);
                  
                   
                  
            		}
            },
            
            
            name: 'Foreign-Born living in US:',
            states: {
                hover: {
                    color: '#a4edba'
                }
            }
        }]
    });
   



// US MAP CODE -------------------------------------------------------



    // Instanciate the map
   var stateMap= Highcharts.mapChart('container1', {

        chart: {
            borderWidth: 1
        },

        title: {
            text: 'Immigrants per State'
        },

        legend: {
            layout: 'horizontal',
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0.85)',
            floating: true,
            verticalAlign: 'bottom',
            y: 19
        },

        mapNavigation: {
            enabled: true
        },

        colorAxis: {
            min: 1,
            type: 'logarithmic',
            minColor: '#EEEEFF',
            maxColor: '#000022',
            stops: [
                [0, '#EFEFFF'],
                [0.67, '#4444FF'],
                [1, '#000022']
            ]
        },

        series: [{
         allowPointSelect: true,
            animation: {
                duration: 1000
            },
            data:countryData["Estimate; Total:"], //countryData["El Salvador"],
            mapData: Highcharts.maps['countries/us/us-all'],
            
            joinBy: ['name','state'], 
            
            events: {
                click: function (event) {
            			// event.point.name is the name of the state/country
            			filterByState(event);
                  
                 
            		}
            },
            
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                format: '{point.code}'
            },
         
            
            name: 'Foreign-Born in',
            tooltip: {
                pointFormat: '{point.name}: {point.value}'
            }
        }]
    });





// Function to select a state and then shows the countries where people come from in the world map //

function filterByState(event) {




	var stateName = event.point.name;
	var newStateData = stateData[stateName];
	console.log(newStateData);
  worldMap.series[0].setData(newStateData);
  

  
  
  
}

// fcuntion to select a coutry, then shows the state where people from that country live in US.  // 

function filterByCountry(event) {




var countryName=event.point.name;
var newCountryData= countryData[countryName];
console.log(newCountryData);
stateMap.series[0].setData(newCountryData); 



}





}); // D3 FUNCTION 





