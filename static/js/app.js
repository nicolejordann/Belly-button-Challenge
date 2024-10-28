// reading json file
//d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
//});

// Initialize the dashboard
(function initializeDashboard() {
    const datasetSelector = d3.select("#selDataset");

    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        data.names.forEach(name => datasetSelector.append("option").text(name).property("value", name));

        const firstSample = data.names[0];
        updateChartsAndMetadata(firstSample);
    });
})();

// Update both charts and metadata based on the selected sample
function updateChartsAndMetadata(sample) {
    updateCharts(sample);
    updateMetadata(sample);
}

// Update charts for the provided sample
function updateCharts(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
        const selectedSample = data.samples.filter(s => s.id == sample)[0];

        const { otu_ids, otu_labels, sample_values } = selectedSample;

        Plotly.newPlot("bubble", [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ], {
            margin: { t: 30 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" }
        });

        Plotly.newPlot("bar", [
            {
                y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ], {
            margin: { t: 30, l: 150 }
        });
    });
}

// Update metadata for the provided sample
function updateMetadata(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
        const metadataPanel = d3.select("#sample-metadata").html("");
        const sampleMetadata = data.metadata.filter(m => m.id == sample)[0];

        Object.entries(sampleMetadata).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

        createGaugeChart(sampleMetadata.wfreq ?? 0);
    });
}

// Create a gauge chart (Bonus)
function createGaugeChart(wfreq) {
    Plotly.newPlot('gauge', [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: { axis: { range: [0, 9] } }
        }
    ], {
        width: 600,
        height: 450,
        margin: { t: 0, b: 0 }
    });
}

// Handle change
function optionChanged(newSample) {
    updateChartsAndMetadata(newSample);
}
