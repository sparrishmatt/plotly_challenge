function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var wfreq = parseFloat(result.wfreq)

    console.log(result)
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });

  var gaugeData = [{
    domain: { x: [0, 1], y: [0, 3] },
    value: wfreq,
    text: wfreq,
    title: { text: "Washing Frequency Per Week" },
    type: "indicator",
    mode: "gauge+number",
    gauge: { axis: { range: [null, 9] },
             steps: [
              { range: [0,2]},
              { range: [2,4]},
              { range: [4,6]},
              { range: [6,8]},
              { range: [8,10]}
             ] 
   }

  }];

  var gaugeLayout = {
    width: 300,
    height: 300
  };

  plotly.newplot("gauge", gaugeData, gaugeLayout);
};

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
  var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
        //  5. Create a variable that holds the first sample in the array.

  var specSampArr = samples.filter(
    (sampleobject) => sampleobject.id == sample);

  var specSamp = specSampArr[0]
  console.log(specSamp)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = specSamp.otu_ids;
    var labels = specSamp.otu_labels;
    var value = specSamp.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = ids.slice(0,10).map((otu_id => `OTU ${otu_id}`)).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x:value.slice(0,10).reverse(),
        y:yticks,
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: ids,
      y: value,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: value
      },
  }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
      automargin: true
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  });
}
 
