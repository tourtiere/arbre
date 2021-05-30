function extractPositions() {
    var data = window.network.getPositions();
    console.log(data);
    var b = JSON.stringify(data);
    str = b.replace(/\\/g, "");
    console.log(str);
}

var promises = [
    fetch("/nodes.json").then((response) => response.json()),
    fetch("/edges.json").then((response) => response.json()),
    fetch("/positions.json").then((response) => response.json()),
];
Promise.all(promises).then(([nodesData, edgesData, positions]) => {
    var container = document.getElementById("mynetwork");
    var nodesDataWithPos = nodesData.map((node) => ({ ...node, ...positions[node.id.toString()] }));
    var nodes = new vis.DataSet(nodesDataWithPos);
    var edges = new vis.DataSet(edgesData);
    var data = { nodes, edges };
    var options = {
        layout: {
            randomSeed: undefined,
            improvedLayout: false,
            clusterThreshold: 150,
            hierarchical: {
                enabled: true,
                levelSeparation: 200,
                nodeSpacing: 200,
                treeSpacing: 250,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: false,
                direction: "UD", // UD, DU, LR, RL
                sortMethod: "directed", // hubsize, directed
            },
        },
        physics: {
            enabled: true,
            barnesHut: {
                theta: 0.5,
                gravitationalConstant: -2000,
                centralGravity: 0.3,
                springLength: 95,
                springConstant: 0.04,
                damping: 0.09,
                avoidOverlap: 0,
            },
            forceAtlas2Based: {
                theta: 0.5,
                gravitationalConstant: -50,
                centralGravity: 0.01,
                springConstant: 0.08,
                springLength: 100,
                damping: 0.4,
                avoidOverlap: 0,
            },
            repulsion: {
                centralGravity: 0.2,
                springLength: 200,
                springConstant: 0.05,
                nodeDistance: 100,
                damping: 0.09,
            },
            hierarchicalRepulsion: {
                centralGravity: 0.0,
                springLength: 100,
                springConstant: 0.01,
                nodeDistance: 120,
                damping: 0.09,
                avoidOverlap: 0,
            },
            maxVelocity: 50,
            minVelocity: 0.1,
            solver: "barnesHut",
            stabilization: {
                enabled: false,
                iterations: 1000,
                updateInterval: 100,
                onlyDynamicEdges: false,
                fit: true,
            },
            timestep: 0.5,
            adaptiveTimestep: true,
            wind: { x: 0, y: 0 },
        },
    };
    var network = new vis.Network(container, data, options);
    window.network = network;
});
