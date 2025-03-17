import { useEffect, useState } from "react";
import Graph from "graphology";
import { ControlsContainer, FullScreenControl, SigmaContainer, useLoadGraph, useRegisterEvents, useSigma , ZoomControl} from "@react-sigma/core";
import "@react-sigma/core/lib/style.css";
import Header from "./components/Header";
import Filter from "./components/Filter";
import Wrapper from "./components/Wrapper";
import { connectionUrl } from "./utils/connectionUrl";

interface Node {
  id: string;
  label: string;
  description?: string;  // Make description optional
}

// Component that handles graph loading and interactions
const LoadGraph = ({filter , setHoveredNode} : {filter : any , setHoveredNode :  (description: string | null) => void}) => {
  const loadGraph = useLoadGraph();
  const sigma = useSigma();
  const [nodes, setNodes] = useState<Node[]>([]);


  const onClickNode = async (nodeId: string) => {
    console.log("clicked");
    console.log(nodeId);
    try {
      const response = await fetch(`${connectionUrl}/api/v1/connection/${nodeId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const { data: { edges, nodes } } = await response.json();

      console.log(nodes); 
      
      const graph = sigma.getGraph();

      // Add new nodes
      nodes.forEach((node: any) => {

        console.log(node);
        if (!graph.hasNode(node.id) && node.label !== "Me") {
          graph.addNode(node.id, {
            label: node.label,
            x: Math.random() * 10,
            y: Math.random() * 10,
            size: node.size || 10,
            color: node.color || "#E57373",
          
          });
        }
      });

      // Add new edges
      edges.forEach((edge: any) => {
        const edgeExists = 
          graph.hasEdge(edge.source, edge.target) || 
          graph.hasEdge(edge.target, edge.source);
        
        if (!edgeExists) {
          graph.addEdge(edge.source, edge.target, {
            type: "line",
            label: edge.label,
            size: edge.size || 2,
            color: edge.color || "#999"
          });
        }
      });

      sigma.refresh();
      
    } catch (error) {
      console.error('Error fetching node connections:', error);
    }
  };

  useEffect(() => { 
    console.log("filter changed");
    const fetchData = async () => {
      const response = await fetch(`${connectionUrl}/api/v1/search?name=${filter.Name}&email=${filter.Email}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { data } = await response.json();
      console.log(data);
      const graph = new Graph();
      setNodes(data.nodes);
      // Add nodes
      data.nodes.forEach((node: any) => {
        if (!graph.hasNode(node.id)) {
          graph.addNode(node.id, {
            label: node.label,
            x: Math.random() * 10,
            y: Math.random() * 10,
            size: node.size || 10,
            color: node.color || "#E57373",
            description: node.description,
          });
        }
      });

      // Add edges
      data.edges.forEach((edge: any) => {
        if (!graph.hasEdge(edge.source, edge.target)) {
          graph.addEdge(edge.source, edge.target, {
            type: "line",
            label: edge.label,
            size: edge.size || 2,
            color: edge.color || "#999"
          });
        }
      });

      loadGraph(graph);

      console.log(data.nodes)
      console.log(data.edges);
    };

    fetchData();

    console.log(nodes)
  }, [loadGraph, filter]);

  // Add hover handlers
  useEffect(() => {
    if (!sigma) return;
    
    sigma.on("clickNode", (event) => onClickNode(event.node));

    sigma.on("wheelNode", (event) => {
      console.log("Zooming", event.event.x, event.event.y, event.event.preventSigmaDefault);
    })
    // Add enter node (hover start) handler
   
    
    return () => {
      sigma.removeAllListeners();
    };
  }, [sigma]);

  useEffect(() => {
   

    sigma.on("enterNode", (event) => {
      const node = nodes.find((n: Node) => n.id === event.node);

      console.log(node);
      if (node?.description) {
        console.log(node.description);
        setHoveredNode(node.description);
      }
      sigma.getContainer().style.cursor = "pointer";
    });

    // Add leave node (hover end) handler
    sigma.on("leaveNode", () => {
      setHoveredNode(null);
      // Reset cursor
      sigma.getContainer().style.cursor = "default";
    });
  }, [nodes]);
 

  // Add tooltip rendering
 
   

  return <>       </>
};

// Main Visual component
export default function Visual() {
  const [filter, setFilter] = useState<{ Name: string, Email: string }>({ Name: "", Email: "" });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  return (
    <div className="flex flex-col w-auto ">
      <Header />

     
      {localStorage.getItem("token") ? (
        <div className="flex flex-col justify-between  md:flex-row ">
           <div className="  bg-white shadow-md z-10  ">
            <Filter setFilter={setFilter} />
          </div>
          <div className=" w-screen bg-white shadow-md flex">

            
            <SigmaContainer 
              style={{ 
                width: "100%", 
                height: "calc(100vh - 40px)",
              }}
              settings={{ 
                renderEdgeLabels: true,
                allowInvalidContainer: true
              }}

               className=" relative w-full h-full"
            >
                  <ControlsContainer  style={{ padding: "10px" }} position={'top-right'}>
        <ZoomControl />
        <FullScreenControl />
       
      </ControlsContainer>
              <LoadGraph  setHoveredNode= { setHoveredNode} filter= {filter}/>
           
            </SigmaContainer>
            { hoveredNode && 
              <div className="absolute top-0 right-0 p-4 bg-white shadow-md">
                <p className="text-sm">{hoveredNode}</p>
              </div>
}
          
          </div>

       
        </div>
      ) : (
        <Wrapper />
      )}
    </div>
  );
}

// export default function Visual() {
//   const graphRef = useRef<HTMLDivElement>(null);
//   const [graphData, setGraphData] = useState<GraphData>();

//   const [sigmaState, setSigmaState] = useState<any>();
//   const [filter, setFilter] = useState< { Name: string, Email: string}>({ Name: "", Email: "" });
  
//   // async function onclickNodeHandler(id: string) {
//   //   try {
//   //     const response = await fetch(`http://localhost:3000/api/v1/connection/${id}`, {
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //       },
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error('Failed to fetch connections');
//   //     }

//   //     const { data: { edges, nodes } } = await response.json();
//   //     console.log(edges);
//   //     if (sigmaState) {
//   //       const graph = sigmaState.getGraph();
        
//   //       // Add new nodes
//   //       nodes.forEach((node: any) => {
//   //         if (!graph.hasNode(node.id) && node.label !== "Me") {
//   //           graph.addNode(node.id, {
//   //             label: node.label,
//   //             x: Math.random() * 10,
//   //             y: Math.random() * 10,
//   //             size: node.size || 10,
//   //             color: node.color || "#E57373",
//   //             shape: "circle",
//   //           });
//   //         }
//   //       });

//   //       // Add new edges
//   //       edges.forEach((edge: any) => {
//   //         // Check both directions for the edge
//   //         const edgeExists = 
//   //           graph.hasEdge(edge.source, edge.target) || 
//   //           graph.hasEdge(edge.target, edge.source);
          
//   //         if (!edgeExists) {
//   //           graph.addEdge(edge.source, edge.target, {
//   //             type: "line",
//   //             label: edge.label,
//   //             size: edge.size || 2,
//   //             color: edge.color || "#999"
//   //           });
//   //         }
//   //       });

 

//   //     }


//   //   } catch (error) {
//   //     console.error('Error fetching node connections:', error);
//   //   }
//   // }


//   // async function onclickNodeHandler(id: string) {
//   //   console.log(id);
//   //   try {
//   //     const response = await fetch(`${connectionUrl}/api/v1/connection/${id}`, {
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //       },
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error('Failed to fetch connections');
//   //     }

//   //     const { data: { edges, nodes } } = await response.json();

//   //     setGraphData((prevData: GraphData | undefined) => {
//   //       if (!prevData) {
//   //         return {
//   //           edges: edges,
//   //           nodes: nodes
//   //         };
//   //       }

//   //       // Create Sets for faster lookup
//   //       const existingEdgeSet = new Set(
//   //         prevData.edges.map((e: any) => `${e.source}-${e.target}`)
//   //       );

//   //       const existingNodeSet = new Set(
//   //         prevData.nodes.map((n: any) => n.id)
//   //       );

//   //       // Filter new edges and nodes
//   //       const newEdges = edges.filter((edge: any) => {
//   //         const forwardKey = `${edge.source}-${edge.target}`;
//   //         const reverseKey = `${edge.target}-${edge.source}`;
//   //         return !existingEdgeSet.has(forwardKey) && !existingEdgeSet.has(reverseKey);
//   //       });

//   //       const newNodes = nodes.filter((node: any) => 
//   //         node.label !== "Me" && !existingNodeSet.has(node.id)
//   //       );

//   //       return {
//   //         edges: [...prevData.edges, ...newEdges],
//   //         nodes: [...prevData.nodes, ...newNodes]
//   //       };
//   //     });

      

//   //   } catch (error) {
//   //     console.error('Error fetching node connections:', error);
//   //   }
//   // }

//   async function onclickNodeHandler(id: string) {
//     console.log(id);
//     try {
//       const response = await fetch(`${connectionUrl}/api/v1/connection/${id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

      
      
//       console.log(response);

//       const { data: { edges, nodes } } = await response.json();

//       if (edges.length > 0 && nodes.length > 0) {
//         let graph = sigmaState.getGraph();
//         console.log(graph);
//         // Add new nodes
//         nodes.forEach((node: any) => {
//           if (!graph.hasNode(node.id) && node.label !== "Me") {
//             graph.addNode(node.id, {
//               label: node.label,
//               x: Math.random() * 10,
//               y: Math.random() * 10,
//               size: node.size || 10,
//               color: node.color || "#E57373",
             
//             });
//           }
//         });

//         // Add new edges
//         edges.forEach((edge: any) => {
//           // Check both directions for the edge
//           const edgeExists = 
//             graph.hasEdge(edge.source, edge.target) || 
//             graph.hasEdge(edge.target, edge.source);
          
//           if (!edgeExists) {
//             graph.addEdge(edge.source, edge.target, {
//               type: "line",
//               label: edge.label,
//               size: edge.size || 2,
//               color: edge.color || "#999"
//             });
//           }
//         });
        
//         graph = sigmaState.getGraph();
//       console.log(graph);
//       console.log(sigmaState);
//       sigmaState.refresh();
//         // Refresh the sigma instance to show new nodes/edges
      
//       }
   
//     } catch (error) {
//       console.error('Error fetching node connections:', error);
//     }
//   }



//     async function fetchData() {
//       console.log(localStorage.getItem("token"));
//         const response = await fetch(`${connectionUrl}/api/v1/search?name=` + filter.Name + "&email=" + filter.Email, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await response.json();
//       console.log(data.data);
//       setGraphData(data.data);
//     }
  

  
//   useEffect(() => {
//     async function fetchData() {
//       console.log(localStorage.getItem("token"));
//           const response = await fetch(`${connectionUrl}/api/v1/connections`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await response.json();
      
//       setGraphData(data.data);
//     }
//     fetchData();
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (sigmaState) {
//         setSigmaState(null);
        
//         sigmaState.kill();
        
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (!graphData || !graphRef.current) return;

//     try {
//       const graph = new Graph();

//       // Add nodes
//       graphData.nodes.forEach((node: any) => {
//         if (!graph.hasNode(node.id)) {
//           graph.addNode(node.id, {
//             label: node.label,
//             x: Math.random() * 10,
//             y: Math.random() * 10,
//             size: node.size || 10,
//             color: node.color || "#E57373",
     
//           });
//         }
//       });

//       // Add edges
//       graphData.edges.forEach((edge: any) => {
//         if (!graph.hasEdge(edge.source, edge.target)) {
//           graph.addEdge(edge.source, edge.target, {
//             type: "line",
//             label: edge.label,
//             size: edge.size || 2,
//             color: edge.color || "#999"
//           });
//         }
//       });

//       const sigmaInstance = new Sigma(graph, graphRef.current, {
//         renderEdgeLabels: true,
//       });

//       setSigmaState(sigmaInstance);

//       // Event listeners
//       sigmaInstance.on("clickNode",  (event: any) => {
//         const clickedNodeId = event?.node;
//         if (clickedNodeId && sigmaInstance) {
//          onclickNodeHandler(clickedNodeId);
//         }
//      sigmaInstance.refresh();
//       });
      
//       // sigmaInstance.on("enterNode", (event: any) => {
//       //   console.log("enterNode event triggered:", event);
//       //   const hoveredNodeId = event?.node;
//       //   if (hoveredNodeId && sigmaInstance) {
//       //     console.log("hoveredNodeId:", hoveredNodeId);
//       //     setHoveredNode(hoveredNodeId);
//       //   }
//       //   sigmaInstance.refresh();
//       // });

          
//       // sigmaInstance.on("leaveNode", (event: any) => {
//       //   console.log("leaving node event triggered:", event);
//       //   const hoveredNodeId = event?.node;
//       //   if (hoveredNodeId && sigmaInstance) {
//       //     console.log("hoveredNodeId:", hoveredNodeId);
//       //     setHoveredNode(null);
//       //   }
//       //   sigmaInstance.refresh();
//       // });

    
      
//       return () => {
//         console.log("killing sigma instance");
//         sigmaInstance.kill();
//       };
//     } catch (error) {
//       console.error("Error creating graph:", error);
//     }
//   }, [graphData]);

 

//   useEffect(() => {
//     fetchData();
//   }, [filter]);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       {localStorage.getItem("token") ? (
//         <div className="flex flex-col md:flex-row flex-1">
//           <div className="w-full md:w-64 lg:w-72 bg-white shadow-md z-10">
//             <Filter setFilter={setFilter} />
//           </div>
          
//           <div className="flex-1 relative bg-gray-100">
//             <div 
//               ref={graphRef} 
//               className="w-full h-[calc(100vh-64px)] md:h-screen"
//             />
//           </div>
//         </div>
//       ) : (
//         <Wrapper />
//       )}
//     </div>
//   );
// }
