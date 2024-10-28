
// Initialize the dashboard
(function initializeDashboard() {
    const datasetSelector = d3.select("#selDataset");

    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        data.names.forEach(name => datasetSelector.append("option").text(name).property("value", name));

        const Sample1 = data.names[0];
        updateChartsAndMetadata(Sample1);
    });
})();


// Filter the metadata for the object with the desired sample number
function updateMetadata(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
        const Panel = d3.select("#sample-metadata").html("");
        const sampleMetadata = data.metadata.filter(m => m.id == sample)[0];

        Object.entries(sampleMetadata).forEach(([key, value]) => {
            Panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

        createGaugeChart(sampleMetadata.wfreq ?? 0);
    });
}

/// Filter the samples for the object with the desired sample number
function updateChartsAndMetadata(sample) {
    updateCharts(sample);
    updateMetadata(sample);
}

// Get the otu_ids, otu_labels, and sample_values
function updateCharts(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
        const selection = data.samples.filter(s => s.id == sample)[0];

        const { otu_ids, otu_labels, sample_values } = selection;

        // Render the Bubble Chart
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


         // Render the Bar Chart
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

// Handle change
function optionChanged(new_sample) {
    updateChartsAndMetadata(new_sample);
}
