const moviesData =
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

d3.json(moviesData)
    .then((data) => ready(data))
    .catch((error) => console.log(error));

const colors = [
    ["Action", "#1f77b4"],
    ["Drama", "#d62728"],
    ["Adventure", "#ff7f0e"],
    ["Family", "#e377c2"],
    ["Animation", "#7f7f7f"],
    ["Comedy", "#2ca02c"],
    ["Biography", "#8c564b"],
]

function ready(data) {
    const width = 1400;
    const height = 800;
    const legendHeigth = 100;

    const svg = d3
        .select("body")
        .append("svg")
        .attr("id", "treeMapContainer")
        .attr("height", height)
        .attr("width", width);

    const hierarchy = d3
        .hierarchy(data, node => node.children)
        .sum(node => node.value)
        .sort((a, b) => b - a);

    const treeMap = d3.treemap().size([width, height - 100]);
    treeMap(hierarchy);
    const leaves = hierarchy.leaves();

    const tiles = svg
        .selectAll("g")
        .data(leaves)
        .enter()
        .append("g")
        .attr("transform", (leaves) => {
            return "translate(" + leaves.x0 + ", " + leaves.y0 + ")";
        });

    const fill = category => {
        let color;
        switch (category) {
            case "Action":
                color = colors[0][1];
                break;
            case "Drama":
                color = colors[1][1];
                break;
            case "Adventure":
                color = colors[2][1];
                break;
            case "Family":
                color = colors[3][1];
                break;
            case "Animation":
                color = colors[4][1];
                break;
            case "Comedy":
                color = colors[5][1];
                break;
            case "Biography":
                color = colors[6][1];
                break;
            default:
                color = "#cccccc";
        }
        return color;
    };

    const tooltip =
        d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .attr('width', 100)
            .attr('height', 50)
            .style("opacity", 0)

    tiles
        .append("rect")
        .attr("class", "tile")
        .style("fill", (d) => fill(d.data.category))
        .attr("data-name", (d) => d.data.name)
        .attr("data-category", (d) => d.data.category)
        .attr("data-value", (d) => d.data.value)
        .attr("width", (leaves) => leaves.x1 - leaves.x0)
        .attr("height", (leaves) => leaves.y1 - leaves.y0)
        .on('mouseover', function (event, d) {

            tooltip
                .html(d.data.name + "<br>$" + Number(d.value).toLocaleString())
                .attr("data-value", d.data.value)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");

            tooltip.text(d.data.name + "\n$" + Number(d.value).toLocaleString());
            tooltip.style("opacity", 1)


        })
        .on('mouseout', function (event, d) {
            tooltip.style("opacity", 0)
        });



    tiles
        .append("text")
        .attr("class", "nameLabel")
        .selectAll("tspan")
        .data((d) => d.data.name.split(" "))
        .enter()
        .append("tspan")
        .attr("x", 5)
        .attr("y", (d, i) => 10 * i + 15)
        .style("font-size", "12px")
        .style('color', 'white')
        .text((d) => d);

    const legend = svg
        .append("svg")
        .attr("id", "legend")
        .attr("height", height)
        .attr('y', height - legendHeigth)
        .attr("width", 1400);

    legend
        .selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("class", "legend-item")
        .attr("width", 25)
        .attr("height", 25)
        .attr("y", 60)
        .attr("x", (d, i) => 18 + i * 35)
        .style("stroke", "black")

        .style("fill", (d, i) => {
            return colors[i][1];
        }
        );

    legend
        .selectAll("text")
        .data(colors)
        .enter()
        .append("text")
        .text((d, i) => colors[i][0].substring(0, 3))
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .attr("x", (d, i) => 18 + i * 35)
        .attr("y", 45);
}