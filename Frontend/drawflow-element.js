import { css, LitElement, html } from 'https://cdn.skypack.dev/lit';
import { style } from './drawflow.style.js';
import './drawflow.min.js';

// editor.addNode(name, inputs, outputs, posx, posy, class, data, html);
class dataNode {

  constructor(name, inputs, outputs, posx, posy, className, data, html) {
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
    this.posx = posx;
    this.posy = posy;
    this.class = className;
    this.data = data;
    this.html = html;
  }
}

function parseDataNodes(jsonString) {
  const dataNodes = JSON.parse(jsonString);
  console.dir(dataNodes)
  return dataNodes["nodes"];
  // return dataNodes.map((node) => {
  //   const { name, inputs, outputs, posx, posy, class: className, data, html } = node;
  //   return new dataNode(name, inputs, outputs, posx, posy, className, data, html);
  // });
}

class DrawflowElement extends LitElement {
  editor = null;
  container = null;
  data = []
  static get styles() {
    return [
      style,
      css`
        #drawflow {
          display: block;
          position: relative;
          width: 100%;
          height: 800px;
        }
      `
    ];
  }

  constructor() {
    super();
    this.dataNodes = [];
  }


  render() {
    return html`
      <button @click=${this._handleClick}>Upload File</button>
      <div id="drawflow"></div>
    `;
  }


  // handle click to upload file and parse it into dataNodes
  _handleClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = readerEvent => {
        const content = readerEvent.target.result;
        const content_obj = JSON.parse(content);
        console.log(content_obj);
        this.editor.clear();
        this.editor.import(content_obj)
      }
    }
    // Events!
    this.editor.on('nodeCreated', function (id) {
      console.log("Node created " + id);
    })

    this.editor.on('nodeRemoved', function (id) {
      console.log("Node removed " + id);
    })

    this.editor.on('nodeSelected', (id) => {
      if (id != null) {
        console.log("Node selected " + id + ": " + typeof (id));
        console.log(this)
        var node = this.editor.getNodeFromId(id);
        console.log(node);
        if (node != null) {
          // Create the popup window
          if (node.description !== null && node.description !== undefined) {
            console.log(node.description)
            var popupWidth = 500;
            var popupHeight = 400;
            var popupName = 'Node Info';
            var popupWindow = window.open('', popupName, 'width=' + popupWidth + ',height=' + popupHeight);
            popupWindow.document.getElementsByTagName('body')[0].innerHTML = '';
            popupWindow.document.write(node.description);
          }
        }
      }
    })

    this.editor.on('moduleCreated', function (name) {
      console.log("Module Created " + name);
    })

    this.editor.on('moduleChanged', function (name) {
      console.log("Module Changed " + name);
    })

    this.editor.on('connectionCreated', function (connection) {
      console.log('Connection created');
      console.log(connection);
    })

    this.editor.on('connectionRemoved', function (connection) {
      console.log('Connection removed');
      console.log(connection);
    })
    /*
        editor.on('mouseMove', function(position) {
          console.log('Position mouse x:' + position.x + ' y:'+ position.y);
        })
    */
    // this.editor.on('nodeMoved', function (id) {
    //   console.log("Node moved " + id);
    // })

    // this.editor.on('zoom', function (zoom) {
    //   console.log('Zoom level ' + zoom);
    // })

    // this.editor.on('translate', function (position) {
    //   console.log('Translate x:' + position.x + ' y:' + position.y);
    // })

    // this.editor.on('addReroute', function (id) {
    //   console.log("Reroute added " + id);
    // })

    // this.editor.on('removeReroute', function (id) {
    //   console.log("Reroute removed " + id);
    // })
    input.click();

  }


  firstUpdated() {
    this.container = this.shadowRoot?.getElementById('drawflow');
    this.editor = new Drawflow(this.container);
    console.log("firstUpdated")
    this.editor.reroute = true;
    this.editor.reroute_fix_curvature = true;

    this.editor.start();

    const data = {
      name: ''
    };

  }
}

customElements.define("drawflow-element", DrawflowElement);
