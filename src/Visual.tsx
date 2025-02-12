import Graph from "graphology";
import { useEffect, useRef, useState } from "react";
import Sigma from "sigma";
import Header from "./components/Header";



export default function Visual() {
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<any>();

  const [sigmaState, setSigmaState] = useState<any>();

  async function onclickNodeHandler(id: string) {
    // seprate logic to handle click event for master node

    console.log("clicked", id);

    const response = await fetch(
      `http://localhost:3000/api/v1/connections/${id}`,
      {
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data: { data: { edges: any[]; nodes: any[] } } =
      await response.json();
    console.log(  " data from backend ")
    console.log(data.data);
    // update the graph state or not ?
    

    let updatedObj: { edges: any[]; nodes: any[] } = {
      edges: [],
      nodes: [],
    };

    console.log("graph data initally")
    console.log(graphData)
    data.data.edges.forEach((edge: any) => 
    {
    
      if (!graphData.edges.some((e : any) => (e.source === edge.source && e.target === edge.target) || (e.source === edge.target && e.target === edge.source) )) {
       
        updatedObj.edges.push(edge);
      }      
      });
    const graph = sigmaState.getGraph();
      console.log( " graph data ")
    console.log( graph)
    data.data.nodes.forEach((node: any) => {

      console.log(node)
      if (node.label !== "Me" && !graph.hasNode(node.id) && !graphData.nodes.some((n : any) => (n.id === node.id ) || (n.label ===  node.label)) )
        updatedObj.nodes.push(node);
    });

    graphData.edges.forEach((edge: any) => updatedObj.edges.push(edge));
    graphData.nodes.forEach((node: any) => updatedObj.nodes.push(node));
    console.log("updated obj ")
    console.log(updatedObj);
    setGraphData(updatedObj);

    console.log(graphData);

    // const graph = sigmaState.getGraph();
    // making new graph as new nodes were not updating on same graph

    // Refresh after removing nodes

    
  }

  
  useEffect(() => {
    async function fetchData() {
      console.log(localStorage.getItem("token"));
      const response = await fetch("http://localhost:3000/api/v1/connections", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      
      setGraphData(data.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (graphData != null) {
      const graph = new Graph();
    
      
      // Adding nodes
console.log(graphData)
      graphData.nodes.forEach((node: any) => {

        if(!graph.hasNode(node.id))
       
        graph.addNode(node.id, {
          label: node.label,
          x: node.x,
          y: node.y,
          size: node.size,
          color: node.color,
          shape: "dot",
        });
      });

      // Adding edges
      graphData.edges.forEach((edge: any) => {
        if(!graph.hasEdge(edge.source, edge.target))
    
        graph.addEdge(edge.source, edge.target, { type: "line", label:  edge.label, size: edge.size  , text : " sd",   color: edge.color});
      });

      // Ensure the graph is created correctly and set the state
      if (graphRef.current != null) {
        const sigmaInstance = new Sigma(graph, 
          graphRef.current , 
        
          {
            // We don't have to declare edgeProgramClasses here, because we only use the default ones ("line" and "arrow")
          
            renderEdgeLabels: true,
          }
        
        );

         

        const gr = sigmaInstance.getGraph();
        setSigmaState(sigmaInstance);

        // Initial filtering of edges based on neighbors count
        // gr.forEachEdge((edge) => {
        //   const source = gr.source(edge);
        //   const target = gr.target(edge);

        //   // Ensure the edge between the source node and the target node is visible
        //   if (
        //     source === target ||
        //     source === target ||
        //     gr.neighbors(source).length > 1 ||
        //     gr.neighbors(target).length > 1
        //   ) {
        //     gr.setEdgeAttribute(edge, "hidden", false); // Show edge if source or target has more than 1 neighbor
        //   } else {
        //     gr.setEdgeAttribute(edge, "hidden", true); // Hide edge if source and target have only 1 neighbor each
        //   }
        // });
        const Camera = sigmaInstance.getCamera();
        Camera.setState({ ratio: 1.5 });
        // Event listener for zoom or node interaction
        sigmaInstance.getCamera().on("updated", () => {
          const zoomRatio = sigmaInstance.getCamera().ratio;
          console.log("Zoom Ratio:", zoomRatio); // Log the zoom ratio for debugging

          // Camera.setState({ ratio: 1.5, x: 0, y: 0, angle: 0 });
          // Update visibility based on zoom ratio
          //   gr.forEachEdge((edge) => {
          //     const source = gr.source(edge);
          //     const target = gr.target(edge);

          //     if (zoomRatio < 0.5) {
          //       if (
          //         gr.neighbors(source).length <= 1 ||
          //         gr.neighbors(target).length <= 1
          //       ) {
          //         gr.setEdgeAttribute(edge, "hidden", false); // Show edge when zoomed in
          //       } else {
          //         gr.setEdgeAttribute(edge, "hidden", true); // Hide other edges when zoomed out
          //       }
          //     } else {
          //       // Show more connections when zoomed out
          //       if (
          //         gr.neighbors(source).length <= 1 ||
          //         gr.neighbors(target).length <= 1
          //       ) {
          //         gr.setEdgeAttribute(edge, "hidden", false); // Show edge
          //       } else {
          //         gr.setEdgeAttribute(edge, "hidden", true); // Hide edge
          //       }
          //     }
          //   });
          // });
        });
        // Event listener for node click to show related edges
        sigmaInstance.on("clickNode", (event: any) => {
          // Log the clicked node for debugging
          const clickedNodeId = event?.node;
          console.log("clickedNodeId", clickedNodeId);
          onclickNodeHandler(clickedNodeId);

          if (!clickedNodeId) {
            console.error("No node clicked or invalid data structure");
            return;
          }
        });

        return () => {
          // Refresh the graph
          sigmaInstance.kill(); // Clean up to avoid duplicate instances
        };
      }
    }
  }, [graphData]);

  return (
    <>
      <Header />

      <div className=" bg-gray-300  w- h-screen" ref={graphRef} />
    </>
  );
}
