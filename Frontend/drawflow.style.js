import { css } from "https://cdn.skypack.dev/lit"; export const style = css`
:root {
  --border-color: #cacaca;
  --background-color: #ffffff;

  --background-box-title: #f7f7f7;
}

html, body {
  margin: 0px;
  padding: 0px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
}

header {
  height: 66px;
  border-bottom: 1px solid var(--border-color);
  padding-left: 20px;
}
header h2 {
  margin: 0px;
  line-height: 66px;
}
header a {
  color: black;
}
.them-edit-link {
  position: absolute;
  top: 10px;
  right: 100px;
  color: black;
  font-size: 40px;
}
.them-edit-link a {
  text-decoration: none;
}

.github-link{
  position: absolute;
  top: 10px;
  right: 20px;
  color: black;
}

.wrapper {
  width: 100%;
  height: calc(100vh - 67px);
  display: flex;
}

.col {
  overflow: auto;
  width: 300px;
  height: 100%;
  border-right: 1px solid var(--border-color);
}

.drag-drawflow {
  line-height: 50px;
  border-bottom: 1px solid var(--border-color);
  padding-left: 20px;
  cursor: move;
  user-select: none;
}
.menu {
  position: absolute;
  height: 40px;
  display: block;
  background: white;
  width: 100%;
}
.menu ul {
  padding: 0px;
  margin: 0px;
  line-height: 40px;
}

.menu ul li {
  display: inline-block;
margin-left: 10px;
border-right: 1px solid var(--border-color);
padding-right: 10px;
line-height: 40px;
cursor: pointer;
}

.menu ul li.selected {
  font-weight: bold;
}

.btn-export {
  float: right;
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-weight: bold;
  border: 1px solid #0e5ba3;
  background: #4ea9ff;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 5;
}

.btn-clear {
  float: right;
  position: absolute;
  top: 10px;
  right: 85px;
  color: white;
  font-weight: bold;
  border: 1px solid #96015b;
  background: #e3195a;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 5;
}
.swal-wide{
    width:80% !important;
}

.btn-lock {
  float: right;
  position: absolute;
  bottom: 10px;
  right: 140px;
  display: flex;
  font-size: 24px;
  color: white;
  padding: 5px 10px;
  background: #555555;
  border-radius: 4px;
  border-right: 1px solid var(--border-color);
  z-index: 5;
  cursor: pointer;
}

.bar-zoom {
  float: right;
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  font-size: 24px;
  color: white;
  padding: 5px 10px;
  background: #555555;
  border-radius: 4px;
  border-right: 1px solid var(--border-color);
  z-index: 5;
}
.bar-zoom svg {
  cursor: pointer;
  padding-left: 10px;
}
.bar-zoom svg:nth-child(1) {
  padding-left: 0px;
}

#drawflow {
  position: relative;
  width: calc(100vw - 301px);
  height: calc(100% - 50px);
  top: 40px;
  background: var(--background-color);
  background-size: 25px 25px;
  background-image:
   linear-gradient(to right, #f1f1f1 1px, transparent 1px),
   linear-gradient(to bottom, #f1f1f1 1px, transparent 1px);
}

@media only screen and (max-width: 768px) {
  .col {
    width: 50px;
  }
  .col .drag-drawflow span {
    display:none;
  }
  #drawflow {
    width: calc(100vw - 51px);
  }
}



/* Editing Drawflow */

.parent-drawflow {
  display: flex;
  overflow: hidden;
  touch-action: none;
  outline:none;
}

.drawflow {
  width: 100%;
  height: 100%;
  position: relative;
  user-select: none;
  perspective: 0;
}

.drawflow .parent-node {
  position: relative;

}

.drawflow .drawflow-node {
  display: flex;
  align-items: center;
  position: absolute;
  background: cyan;
  width: 160px;
  min-height: 40px;
  border-radius:4px;
  border: 2px solid black;
  color: black;
  z-index: 2;
  padding: 15px;
}

.drawflow .drawflow-node.selected {
  background: red;
}
.drawflow .drawflow-node:hover {
  cursor: move;
}

.drawflow .drawflow-node .inputs, .drawflow .drawflow-node .outputs {
  width: 0px;
}

.drawflow .drawflow-node .drawflow_content_node {
  width: 100%;
  display: block;
}

.drawflow .drawflow-node .input, .drawflow .drawflow-node .output {

  position: relative;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  border: 2px solid black;
  cursor: crosshair;
  z-index: 1;
  margin-bottom: 5px;
}

.drawflow-node input, .drawflow-node select, .drawflow-node textarea {
  border-radius: 4px;
  border: 1px solid var(--border-color);
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  width: 140px;
  color: #555555;
}



.drawflow .drawflow-node .input {
  left: -27px;
  top: 2px;
  background: yellow;
}
.drawflow .drawflow-node .output {
  right: -3px;
  top: 2px;
}

.drawflow svg {
  z-index: 0;
  position: absolute;
  overflow: visible !important;
}
.drawflow .connection {
  position: absolute;
  pointer-events: none;
  aspect-ratio: 1 / 1;
}
.drawflow .connection .main-path {
  fill: none;
  stroke-width: 5px;
  stroke: steelblue;
  pointer-events: all;
}
.drawflow .connection .main-path:hover {
  stroke: #1266ab;
  cursor: pointer;
}

.drawflow .connection .main-path.selected {
  stroke: #43b993;
}

.drawflow .connection .point {
  cursor: move;
  stroke: black;
  stroke-width: 2;
  fill: white;
  pointer-events: all;
}

.drawflow .connection .point.selected, .drawflow .connection .point:hover {
  fill: #1266ab;
}

.drawflow .main-path {
  fill: none;
  stroke-width: 5px;
  stroke: steelblue;
}

.drawflow-delete {
  position: absolute;
  display: block;
  width: 30px;
  height: 30px;
  background: black;
  color: white;
  z-index: 4;
  border: 2px solid white;
  line-height: 30px;
  font-weight: bold;
  text-align: center;
  border-radius: 50%;
  font-family: monospace;
  cursor: pointer;
}
.drawflow > .drawflow-delete {
  margin-left: -15px;
  margin-top: 15px;
}

.parent-node .drawflow-delete {
  right: -15px;
  top: -15px;
}



/* Modal */
.modal {
  display: none;
  position: fixed;
  z-index: 7;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.7);

}

.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 400px; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.modal .close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor:pointer;
}

@media only screen and (max-width: 768px) {
  .modal-content {
    width: 80%;
  }
}

`;