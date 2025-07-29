import { useEffect, useRef, useState } from "react";
import Graph from "graphology";
import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  useLoadGraph,
  useSigma,
  ZoomControl,
} from "@react-sigma/core";
import "@react-sigma/core/lib/style.css";
import Header from "./components/Header";
import Filter, { InputType } from "./components/Filter";
import Wrapper from "./components/Wrapper";
import { connectionUrl } from "./utils/connectionUrl";
import { addConnection, ConnectionData, formObject } from "./AddConnection";

import { useTranslation } from "react-i18next";

interface Node {
  id: string;
  label: string;
  description?: string;
  email: string; // Make description optional
  phoneNumber: string;
  type: string;
}
interface ConnectedNode {
  color: string;
  email: string;
  id: string;
  label: string;
  phoneNumber: string;
  size: number;
  x: number;
  y: number;
  connectionType?: string;
}
export const onDownloadClickHandler = async (downloadType: string) => {
  try {
    let connectionStream: any;
    if (downloadType === "json") {
      connectionStream = await fetch(
        `${connectionUrl}/api/v1/connections-json`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } else {
      connectionStream = await fetch(
        `${connectionUrl}/api/v1/download-connections`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }

    let blob;

    if (downloadType === "json") {
      // Replace this with your actual check
      const jsonString = JSON.stringify(await connectionStream.json(), null, 2); // Pretty print
      blob = new Blob([jsonString], { type: "application/json" });
    } else {
      blob = await connectionStream.blob(); // Assuming PDF
    }

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;

    // Change filename based on file type
    a.download =
      downloadType === "json" ? "connections.json" : "connections.pdf";

    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log("Error downloading the file", error);
  }
};
// Component that handles graph loading and interactions
const LoadGraph = ({
  filter,
  setHoveredNode,
  connectedNodes,
  connectNodesFn,
  sizeOfNodes,
  flag,
  refreshNodes,
  mode,
  connectedMultipleNodes,
  connectMultipleNodesFn,
  setPositionToFill,
  postionToFill,
}: {
  filter: InputType;
  setHoveredNode: (inp: { [key: string]: any } | null) => void;
  connectedNodes: { [key: string]: any };
  connectNodesFn: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ConnectedNode;
    }>
  >;
  sizeOfNodes: number;
  flag: boolean;
  refreshNodes: boolean;
  mode: string;
  connectedMultipleNodes: { [key: string]: any };
  connectMultipleNodesFn: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ConnectedNode[];
    }>
  >;
  setPositionToFill: React.Dispatch<React.SetStateAction<number>>;
  postionToFill: number;
}) => {
  const loadGraph = useLoadGraph();
  const sigma = useSigma();
  const [nodes, setNodes] = useState<Node[]>([]);

  //first user will pres ctrl probabvly show the add connection by clicking two nodes activated
  //  popup for fincal confiramtion that you want to t add connection between two nodes or not
  // if yes then add connection between two nodes and then refresh the graph
  // if no then remove the popup and do nothing
  //

  const size = Object.entries(connectedNodes).length;
  const size2 = Object.entries(connectedMultipleNodes).length;
  console.log("Size of connectedNodes:", size);
  console.log("Size of connectedMultipleNodes:", size2);

  console.log("Mode ", mode);
  const onClickNode = async (nodeId: string) => {
    console.log("clicked");
    console.log(nodeId);
    try {
      const response = await fetch(
        `${connectionUrl}/api/v1/connection/${nodeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const {
        data: { edges, nodes },
      } = await response.json();

      console.log("flasg", flag);

      console.log("Multiple object", connectedMultipleNodes);
      console.log("Keys", Object.keys(connectedMultipleNodes));
      console.log(
        "check",
        Object.keys(connectedMultipleNodes).filter((key) => {
          return (function () {
            let k = key as string;

            return connectedMultipleNodes[k].some(
              (node: any) => node.id === nodeId
            );
          })();
        })
      );

      if (
        flag &&
        sizeOfNodes < 2 &&
        !connectedNodes.hasOwnProperty(nodeId) &&
        mode === "single"
      ) {
        connectNodesFn((prev) => {
          return {
            ...prev,
            [nodeId]: nodes.filter((node: any) => node.id === nodeId)[0],
          };
        });
        console.log("connectedNodes", connectedNodes);
      } else if (
        flag &&
        !(
          Object.keys(connectedMultipleNodes).filter((key) => {
            return (function () {
              let k = key as string;

              return connectedMultipleNodes[k].some(
                (node: any) => node.id === nodeId
              );
            })();
          }).length > 0
        ) &&
        mode === "multiple"
      ) {
        console.log("connectedMultipleNodees from inside");
        if (connectedMultipleNodes[postionToFill.toString()].length < 2) {
          connectMultipleNodesFn((prev) => {
            return {
              ...prev,
              [postionToFill.toString()]: [
                ...connectedMultipleNodes[postionToFill.toString()],
                nodes.filter((node: any) => node.id === nodeId)[0],
              ],
            };
          });

          if (connectedMultipleNodes[postionToFill.toString()].length === 1) {
            const res = prompt(
              "Please enter the connection type you want to add them between these 2 nodes"
            );
            console.log("res", res);
            if (res) {
              connectedMultipleNodes[
                postionToFill.toString()
              ][0].connectionType = res;
            }
          }
        } else {
          connectMultipleNodesFn((prev) => {
            return {
              ...prev,
              [(postionToFill + 1).toString()]: [
                nodes.filter((node: any) => node.id === nodeId)[0],
              ],
            };
          });
          setPositionToFill((prev) => prev + 1);
        }
      }

      console.log("connectedNodes", connectedNodes);
      console.log("connectedMultipleNodes", connectedMultipleNodes);

      const graph = sigma.getGraph();

      // Add new nodes
      nodes.forEach((node: any) => {
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
            color: edge.color || "#999",
          });
        }
      });

      sigma.refresh();
    } catch (error) {
      console.error("Error fetching node connections:", error);
    }
  };

  useEffect(() => {
    console.log("refreshNodes", refreshNodes);
    const fetchData = async () => {
      const response = await fetch(
        `${connectionUrl}/api/v1/search?name=${filter.Name}&email=${filter.Email}&phoneNumber=${filter.phoneNumber}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data } = await response.json();

      console.log("Data from fetch", data);
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
            color: edge.color || "#999",
          });
        }
      });

      loadGraph(graph);

      console.log("Nodes");
      console.log(data.nodes);
    };

    fetchData();
  }, [loadGraph, filter, refreshNodes]);

  // Add hover handlers
  useEffect(() => {
    if (!sigma) return;

    sigma.on("clickNode", (event) => onClickNode(event.node));

    sigma.on("wheelNode", (event) => {
      console.log(
        "Zooming",
        event.event.x,
        event.event.y,
        event.event.preventSigmaDefault
      );
    });
    // Add enter node (hover start) handler

    return () => {
      sigma.removeAllListeners();
    };
  }, [sigma, flag, connectedNodes, connectedMultipleNodes, mode, sizeOfNodes]);

  useEffect(() => {
    sigma.on("enterNode", (event) => {
      const node = nodes.find((n: Node) => n.id === event.node);

      const obj = {
        id: event.node,
        Label: node ? node.label : "",
        Description: node ? node.description : "",
        Email: node ? node.email : "",
        phoneNumber: node ? node.phoneNumber : "",
        type: node ? node.type : "",
      };

      if (obj != null) {
        setHoveredNode(obj);
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

  return <> </>;
};

// Main Visual component

export default function Visual() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState<InputType>({
    Name: "",
    Email: "",
    phoneNumber: "",
  });
  const [hoveredNode, setHoveredNode] = useState<{
    [key: string]: string;
  } | null>(null);

  const [keyHelper, setKeyHelper] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [mode, setMode] = useState<string>("single");
  // Reference to the button for connecting nodes
  // This is used to programmatically click the button when needed
  // this used to ref for downliade pdf file buttons
  
  // Foloowing 2 are used acording to the mode value selceted above
  const [connectedNodes, setConnectedNodes] = useState<{
    [key: string]: ConnectedNode;
  }>({});
  const [connectedMultipleNodes, setMultipleConnectedNodes] = useState<{
    [key: string]: ConnectedNode[];
  }>({ "0": [] });
  const [postionToFill, setPositionToFill] = useState<number>(0);

  function addConnectionMultiple(
    connectedMultipleNodes: { [key: string]: ConnectedNode[] },
    setKeyHelper: React.Dispatch<React.SetStateAction<boolean>>,
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
    setMultipleConnectedNodes: React.Dispatch<React.SetStateAction<{}>>,
    setMode: React.Dispatch<React.SetStateAction<string>>,
    setPositionToFill: React.Dispatch<React.SetStateAction<number>>
  ) {
    console.log("connectedMultipleNodes clicke");
    try {
      Object.keys(connectedMultipleNodes).forEach((obj) =>
        formObject.parse({
          mainemail: connectedMultipleNodes[obj][0].email,
          conemail: connectedMultipleNodes[obj][1].email,
          mainphone: connectedMultipleNodes[obj][0].phoneNumber,
          conphone: connectedMultipleNodes[obj][1].phoneNumber,
          entityType:
            connectedMultipleNodes[obj][0].color === "blue" ||
            connectedMultipleNodes[obj][1].color === "blue"
              ? "Workplace"
              : "Normal",
          connection: connectedMultipleNodes[obj][0].connectionType,
          mainusername: connectedMultipleNodes[obj][0].label,
          conusername: connectedMultipleNodes[obj][1].label,
        })
      );
    } catch (error) {
      alert(" Please select the correct ones");
      return;
    }

    const userResponse = confirm(
      "Do you want to add connection between these nodes?"
    );
    console.log("userResponse", userResponse);
    if (userResponse) {
      let outArr: any = Object.keys(connectedMultipleNodes).map((obj) => ({
        mainUserEmail: connectedMultipleNodes[obj][0].email,
        conUserEmail: connectedMultipleNodes[obj][1].email,
        mainPhone: connectedMultipleNodes[obj][0].phoneNumber,
        conPhone: connectedMultipleNodes[obj][1].phoneNumber,

        mainUserName: connectedMultipleNodes[obj][0].label,
        conUserName: connectedMultipleNodes[obj][1].label,
        connection: connectedMultipleNodes[obj][0].connectionType || "",

        entityType:
          connectedMultipleNodes[obj][0].color === "blue" ||
          connectedMultipleNodes[obj][1].color === "blue"
            ? "Workplace"
            : "Normal",
      }));

      const connectionArr: ConnectionData[] = outArr ? outArr : [];

      addConnection({ connections: connectionArr });

      setMultipleConnectedNodes({});
      setKeyHelper(false);
      setPositionToFill(0);
      setMode("single");
      setTimeout(() => {
        setRefresh((prev) => !prev);
      }, 1000);
    } else return;
  }

  const onClickHandler = (connectedMultipleNodes: {
    [key: string]: ConnectedNode[];
  }) => {
    addConnectionMultiple(
      connectedMultipleNodes,
      setKeyHelper,
      setRefresh,
      setMultipleConnectedNodes,
      setMode,
      setPositionToFill
    );
  };

  // Effect to handle connection between nodes
  // This effect will run when two nodes are connected in single mode
  useEffect(() => {
    if (
      Object.keys(connectedNodes).length === 2 &&
      keyHelper &&
      mode === "single"
    ) {
      // mainemail: connectedNodes[Object.keys(connectedNodes)[0]]?.email,
      // alert(
      //   "You have selected connect  nodes by drag and drop. Please select the 2 nodes to connect"
      // );

      const res = prompt(
        "Please enter the connection type you want to add them between these 2 nodes"
      );
      console.log("res", res);
      try {
        formObject.parse({
          mainemail: connectedNodes[Object.keys(connectedNodes)[0]].email,
          conemail: connectedNodes[Object.keys(connectedNodes)[1]].email,
          mainphone: connectedNodes[Object.keys(connectedNodes)[0]].phoneNumber,
          conphone: connectedNodes[Object.keys(connectedNodes)[1]].phoneNumber,
          entityType:
            connectedNodes[Object.keys(connectedNodes)[0]].color === "blue" ||
            connectedNodes[Object.keys(connectedNodes)[1]].color === "blue"
              ? "Workplace"
              : "Normal",
          connection: res,
          mainusername: connectedNodes[Object.keys(connectedNodes)[0]].label,
          conusername: connectedNodes[Object.keys(connectedNodes)[1]].label,
        });
      } catch (error) {
        alert(" Please select the correct ones");
        return;
      }

      const userResponse = confirm(
        "Do you want to add connection between these two nodes?"
      );
      console.log("userResponse", userResponse);
      if (userResponse) {
        const connectionArr: ConnectionData[] = [
          {
            mainUserEmail: connectedNodes[Object.keys(connectedNodes)[0]].email,
            conUserEmail: connectedNodes[Object.keys(connectedNodes)[1]].email,
            mainPhone:
              connectedNodes[Object.keys(connectedNodes)[0]].phoneNumber,
            conPhone:
              connectedNodes[Object.keys(connectedNodes)[1]].phoneNumber,

            mainUserName: connectedNodes[Object.keys(connectedNodes)[0]].label,
            conUserName: connectedNodes[Object.keys(connectedNodes)[1]].label,
            connection: res || "",

            entityType:
              connectedNodes[Object.keys(connectedNodes)[0]].color === "blue" ||
              connectedNodes[Object.keys(connectedNodes)[1]].color === "blue"
                ? "Workplace"
                : "Normal",
          },
        ];

        addConnection({ connections: connectionArr });

        setConnectedNodes({});
        setKeyHelper(false);

        setTimeout(() => {
          setRefresh((prev) => !prev);
        }, 1000);
      } else return;
    }
  }, [connectedNodes]);

  useEffect(() => {
    if (keyHelper) {
      alert(
        `You have selected connect ${mode} node${
          mode === "single" ? "" : "s"
        } by drag and drop. Please select the nodes to connect`
      );
    }
  }, [mode, keyHelper]);

  useEffect(() => {

    
    if(localStorage.getItem("token")) {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("Key pressed:", `${keyHelper}`);

      if (e.key === "Control") {
        setKeyHelper((prev) => {
          const newState = !prev;
          alert(`Drag mode ${newState ? "on" : "off"}!`);

          if (!newState) {
            setConnectedNodes({});
            setMultipleConnectedNodes({ "0": [] });
            setPositionToFill(0);
            setMode("single");
          }
          return newState;
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);


    return () => {
      document.removeEventListener("keydown", handleKeyDown);
     
    };
  }}, []);

  return (
    <div className="flex flex-col w-auto ">
      <Header />

      {localStorage.getItem("token") ? (
        <div className="flex flex-col justify-between  md:flex-row ">
          <div className="  bg-white shadow-md z-10  ">
            <Filter setFilter={setFilter} />
          </div>
          <div className=" w-screen bg-white shadow-md flex-row">
            <div className="flex flex-row justify-between items-center p-4 w-full">
              <div className="flex flex-col justify-top items-center p-4 w-max">
                <p className="text-2xl font-bold text-gray-800 p-4">
                  {t("Drag add connection mode :")}{" "}
                  <span>{keyHelper ? t("On") : t("Off")}</span>
                </p>
                <p>
                  {t("Toggle the drag mode by pressing the")} <strong> {t("Ctrl")}</strong>{" "}
                  {t("key.")}
                </p>
                <div className="flex gap-4 p-2 flex-row items-center justify-center">
                  <label className="flex items-center gap-1 justify-items-center">
                    {t("Single")}
                    <input
                      type="radio"
                      name="selectMode"
                      value="single"
                      disabled={!keyHelper}
                      checked={mode === "single"}
                      onChange={() => {
                        setMode("single");
                      }}
                    />
                  </label>
                  <label className="flex items-center gap-1 justify-items-center">
                    {t("Multiple")}
                    <input
                      type="radio"
                      name="selectMode"
                      value="multiple"
                      disabled={!keyHelper}
                      checked={mode === "multiple"}
                      onChange={() => {
                        setMode("multiple");
                      }}
                    />
                  </label>
                  {mode === "multiple" && keyHelper && (
                    <button
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      onClick={() => onClickHandler(connectedMultipleNodes)}
                    >
                      {t("Connect")}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <SigmaContainer
              style={{
                width: "100%",
                height: "calc(100vh - 40px)",
              }}
              settings={{
                renderEdgeLabels: true,
                allowInvalidContainer: true,
              }}
              className=" relative w-full h-full"
            >
              <ControlsContainer
                style={{ padding: "10px" }}
                position={"top-right"}
              >
                <ZoomControl />
                <FullScreenControl />
              </ControlsContainer>
              <LoadGraph
                setHoveredNode={setHoveredNode}
                filter={filter}
                connectedNodes={connectedNodes}
                connectNodesFn={setConnectedNodes}
                sizeOfNodes={Object.entries(connectedNodes).length}
                flag={keyHelper}
                refreshNodes={refresh}
                mode={mode}
                connectedMultipleNodes={connectedMultipleNodes}
                connectMultipleNodesFn={setMultipleConnectedNodes}
                setPositionToFill={setPositionToFill}
                postionToFill={postionToFill}
              />
            </SigmaContainer>
            {hoveredNode && (
              <div className="absolute top-16 right-16 p-4  shadow-md bg-gray-400 border-1">
                <p className="text-md">
                  {" "}
                  id : {hoveredNode ? hoveredNode.id : ""}
                </p>
                <p className="text-md">
                  {" "}
                  Label : {hoveredNode ? hoveredNode.Label : ""}
                </p>
                <p className="text-md">
                  {" "}
                  Description : {hoveredNode ? hoveredNode.Description : ""}
                </p>
                <p className="text-md">
                  {" "}
                  Email: {hoveredNode ? hoveredNode.Email : ""}
                </p>
                <p className="text-md">
                  {" "}
                  Phone Number: {hoveredNode ? hoveredNode.phoneNumber : ""}
                </p>
                <p className="text-md">
                  {" "}
                  Type: {hoveredNode ? hoveredNode.type : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Wrapper />
      )}
    </div>
  );
}
