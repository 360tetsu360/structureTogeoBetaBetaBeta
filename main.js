var scene
var group
$(function() {
  $('#file').change(function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function() {
      var data = reader.result
      nbt.parse(data, function(error, data) {
        if (error) {
          throw error;
        }
        //$('#tin').html(JSON.stringify(data,null,"  "))
        towakariyasui(data);
        alert("コピーしました");
      });
    }

    reader.readAsArrayBuffer(file);
  });
});
function block(bloock_t){
  this.name = bloock_t.name.value;
  this.states = bloock_t.states.value;
}
function vec3_t(x1,y1,z1){
  this.x = x1;
  this.y = y1;
  this.z = z1;
}
function cube(origin,offset){
  this.origin = origin;
  this.offset = offset; 
  this.newOffset = (offset)=>{
    this.offset = offset; 
  }

}
var json = {
	"format_version": "1.12.0",
	"minecraft:geometry": [
		{
			"description": {
				"identifier": "geometry.geometry.zombie:geometry.humanoid",
				"texture_width": 64,
				"texture_height": 32,
				"visible_bounds_width": 4,
				"visible_bounds_height": 4,
				"visible_bounds_offset": [0, 1, 0]
			},"bones": [
        {
					"name": "a",
					"pivot": [0, 0, 0],
					"mirror": false,
					"cubes": []
        }
      ]
    }
  ]
}
var blocks_t = [];
function towakariyasui(data){
  var blocks = data.value.structure.value.palette.value.default.value.block_palette.value.value;
  for (let i = 0; i < blocks.length; i++) {
    blocks_t.push(new block(blocks[i]));
  }
  var poses = data.value.size.value.value
  var bData = data.value.structure.value.block_indices.value.value[0].value;
  while(group.children.length > 0){ 
    group.remove(group.children[0]); 
  }
  var index = 0;
  var cubes = [];
  for (let x = 0; x < poses[0]; x++) {
    var xmen = [];
    for (let y = 0; y < poses[1]; y++) {
      var yjik = []
      var test = 0;
      for (let z = 0; z < poses[2]; z++) {
        if(blocks_t[bData[index]].name !="minecraft:air"){
          const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
          mesh.position.x = x;
          mesh.position.y = y;
          mesh.position.z = z;
          group.add(mesh);
          var a = {"origin": [x, y, z], "size": [1, 1, 1], "uv": [0, 0]};
          json["minecraft:geometry"][0].bones[0].cubes.push(a);
        }
        index++;
      }
    }
  }
  let blob = new Blob([JSON.stringify(json,null,"  ")],{type:"text/plan"});
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'geo.json';
  link.click();
}

window.addEventListener('load', init);

function init() {
  const width = 960;
  const height = 540;
  const canvasElement = document.querySelector('#myCanvas')
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
  });
  renderer.setSize(width, height);
  scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, 10);
  const controls = new THREE.OrbitControls(camera, canvasElement);
  //const mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshNormalMaterial());
  group = new THREE.Group();5
  scene.add(group);
  //scene.add(mesh);

  tick();
  function tick() {
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}