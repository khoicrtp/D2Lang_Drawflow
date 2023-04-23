package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"oss.terrastruct.com/d2/d2graph"
	"oss.terrastruct.com/d2/d2layouts/d2dagrelayout"
	"oss.terrastruct.com/d2/d2lib"
	"oss.terrastruct.com/d2/d2renderers/d2svg"
	"oss.terrastruct.com/d2/d2target"
	"oss.terrastruct.com/d2/d2themes/d2themescatalog"
	"oss.terrastruct.com/d2/lib/textmeasure"
)

var CURR_ID int = 1

var ID_NAME = make(map[int]string)
var NAME_ID = make(map[string]int)

var TUNE_DISTANCE = 1.5

func readAllFromFile(path string) []byte {
	data, _ := ioutil.ReadFile(path)
	return data
}

type ExportData struct {
	Drawflow Drawflow `json:"drawflow"`
}
type Drawflow struct {
	Home Home `json:"Home"`
}
type Home struct {
	Data map[string]*data `json:"data"`
}
type raw_connections struct {
	ID  string `json:"id"`
	Src string `json:"input"`
	Dst string `json:"output"`
}
type connections struct {
	Node   string `json:"node"`
	Input  string `json:"input,omitempty"`
	Output string `json:"output,omitempty"`
}
type input_connections struct {
	Connections []connections `json:"connections,omitempty"`
}
type output_connections struct {
	Connections []connections `json:"connections,omitempty"`
}

type data struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
	Data struct {
	} `json:"data"`
	Class       string                         `json:"class"`
	Html        string                         `json:"html"`
	Description string                         `json:"description,omitempty"`
	Typenode    bool                           `json:"typenode"`
	Inputs      map[string]*input_connections  `json:"inputs,omitempty"`
	Outputs     map[string]*output_connections `json:"outputs,omitempty"`
	Pos_x       int                            `json:"pos_x"`
	Pos_y       int                            `json:"pos_y"`
}

// func (d data) String() string {
// 	connections_string := ""
// 	for _, connection := range d.Inputs["input_1"].Connections {
// 		connections_string += connection.String()
// 	}
// 	for _, connection := range d.Outputs["output_1"].Connections {
// 		connections_string += connection.String()
// 	}
// 	return fmt.Sprintf("Id: %s, Name: %s, Pos_x: %d, Pos_y: %d, Conn: %s", d.Id, d.Name, d.Pos_x, d.Pos_y, connections_string)
// }

func formalString(data string) string {
	data = strings.ReplaceAll(data, `"`, ``)
	data = strings.ReplaceAll(data, ` `, `_`)

	return data
}

func (c raw_connections) String() string {
	return fmt.Sprintf("[+] Node: %s, Src: %s, Dst: %s", c.ID, c.Src, c.Dst)
}

func getAllConnections(diagram *d2target.Diagram) []raw_connections {
	var res []raw_connections
	for _, connection := range diagram.Connections {
		var connection_data raw_connections
		connection_data.ID = connection.ID
		connection_data.Src = connection.Src
		connection_data.Dst = connection.Dst
		res = append(res, connection_data)
	}
	return res
}

func getAllNodes(diagram *d2target.Diagram) map[string]*data {
	nodes := make(map[string]*data)
	for _, node := range diagram.Shapes {
		node_data := new(data)
		name := formalString(node.ID)
		node.ID = fmt.Sprint(CURR_ID)

		node_data.Id = CURR_ID
		ID_NAME[CURR_ID] = name
		NAME_ID[name] = CURR_ID
		node_data.Class = name
		node_data.Name = name
		node_data.Pos_x = int(float64(node.Pos.X) * TUNE_DISTANCE)
		node_data.Pos_y = int(float64(node.Pos.Y) * TUNE_DISTANCE)
		node_data.Html = name
		CURR_ID++
		nodes[node.ID] = node_data
		nodes[node.ID].Inputs = make(map[string]*input_connections)
		nodes[node.ID].Inputs["input_1"] = new(input_connections)
		nodes[node.ID].Outputs = make(map[string]*output_connections)
		nodes[node.ID].Outputs["output_1"] = new(output_connections)
		//nodes = append(nodes, node_data)
	}
	return nodes
}

func exportDataToJSON(data ExportData) []byte {
	json_data, _ := json.Marshal(data)
	return json_data
}
func formalJsonData(data []byte) []byte {
	res := string(data)
	fmt.Println("\n\nBefore: \n", res)
	res = strings.ReplaceAll(res, `\u003c`, `<`)
	res = strings.ReplaceAll(res, `\u003e`, `>`)
	res = strings.ReplaceAll(res, `"input_1":{}`, ``)
	res = strings.ReplaceAll(res, `"output_1":{}`, ``)

	return []byte(res)
}
func writeByteToFile(data []byte) {
	_ = ioutil.WriteFile(filepath.Join("out.json"), data, 0600)
}

func getNodeIdByName(nameFind string) string {
	for id, name := range ID_NAME {
		if nameFind == name {
			return fmt.Sprint(id)
		}
	}
	return ""
}

func updateDataWithConnection(res map[string]*data, Raw_connections []raw_connections) map[string]*data {
	for _, connection := range Raw_connections {
		fmt.Println("Looking for connection: ", connection.Src, " -> ", connection.Dst)
		for _, node := range res {
			if node.Name == connection.Dst {
				fmt.Println("Found connection: ", connection.Src, " -> ", connection.Dst, "")
				custom_conn := connections{Node: fmt.Sprint(NAME_ID[connection.Src]), Input: "output_1"}
				res[fmt.Sprint(node.Id)].Inputs["input_1"].Connections = append(res[fmt.Sprint(node.Id)].Inputs["input_1"].Connections, custom_conn)

				//res[node.Id].Inputs["input_1"].Connections = append(res[node.Id].Inputs["input_1"].Connections, connection)
				//res[node.Id].Inputs.Connections = append(res[node.Id].Inputs.Connections, connection)
			} else if node.Name == connection.Src {
				fmt.Println("Found connection: ", connection.Src, " -> ", connection.Dst, "")
				custom_conn := connections{Node: fmt.Sprint(NAME_ID[connection.Dst]), Output: "input_1"}
				res[fmt.Sprint(node.Id)].Outputs["output_1"].Connections = append(res[fmt.Sprint(node.Id)].Outputs["output_1"].Connections, custom_conn)
				//res[node.Id].Outputs["output_1"].Connections = append(res[node.Id].Outputs["output_1"].Connections, connection)
				//res[node.Id].Outputs.Connections = append(res[node.Id].Outputs.Connections, connection)

			}
		}
	}
	return res
}

func main() {
	d2_model := string(readAllFromFile(filepath.Join("model.txt")))
	ruler, _ := textmeasure.NewRuler()
	defaultLayout := func(ctx context.Context, g *d2graph.Graph) error {
		return d2dagrelayout.Layout(ctx, g, nil)
	}
	diagram, _, _ := d2lib.Compile(context.Background(), d2_model, &d2lib.CompileOptions{
		Layout: defaultLayout,
		Ruler:  ruler,
	})
	//fmt.Println(diagram)
	for i, _ := range diagram.Shapes {
		diagram.Shapes[i].ID = formalString(diagram.Shapes[i].ID)
	}
	nodes := getAllNodes(diagram)

	connections := getAllConnections(diagram)
	// for _, connection := range connections {
	// 	fmt.Println(connection.String())
	// }
	for i, _ := range connections {
		connections[i].ID = formalString(connections[i].ID)
		connections[i].Src = formalString(connections[i].Src)
		connections[i].Dst = formalString(connections[i].Dst)
	}
	nodes = updateDataWithConnection(nodes, connections)
	// for _, node := range nodes {
	// 	fmt.Println(node.String())
	// }
	// for _, node := range nodes {
	// 	fmt.Println(node.String())
	// }
	exported_json := exportDataToJSON(ExportData{Drawflow{Home{nodes}}})
	exported_json = formalJsonData(exported_json)
	writeByteToFile(exported_json)
	//drawflow_data := ExportData{}

	// for _, node := range diagram.Shapes {
	// 	fmt.Println("Pos: ", node.Pos, "Width: ", node.Width, "Height: ", node.Height)
	// }
	// for _, connection := range diagram.Connections {
	// 	fmt.Println(connection.Src + "-" + connection.Text.Label + "->" + connection.Dst)
	// }

	out, _ := d2svg.Render(diagram, &d2svg.RenderOpts{
		Pad:     d2svg.DEFAULT_PADDING,
		ThemeID: d2themescatalog.GrapeSoda.ID,
	})
	_ = ioutil.WriteFile(filepath.Join("out.svg"), out, 0600)

	file, err := os.Open("out.svg")
	if err != nil {
		panic(err)
	}
	defer file.Close()

}
