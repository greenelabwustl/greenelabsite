// Setup renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize($('.main-block').width(),$('.main-block').height());
$('.main-block').append(renderer.domElement);

// Setup scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xBFD8D2);

// Setup lighting
var light = new THREE.PointLight(0xffffff,1,800);
light.position.set(0,300,0);
scene.add(light);
var light = new THREE.PointLight(0xffffff,1,800);
light.position.set(300,0,0);
scene.add(light);
var light = new THREE.PointLight(0xffffff,1,800);
light.position.set(0,0,300);
scene.add(light);
var light = new THREE.PointLight(0xffffff,1,800);
light.position.set(0,-300,0);
scene.add(light);
var light = new THREE.PointLight(0xffffff,1,800);
light.position.set(-300,0,0);
scene.add(light);
var light = new THREE.PointLight(0xffffff,1,800);
light.position.set(0,0,-300);
scene.add(light);

// Setup camera
var w = 0.925;
var h = 1;
var camera = new THREE.PerspectiveCamera(60,($('.main-block').width()*w)/($('.main-block').height()*h),0.1,1000);
camera.position.z = 250;
camera.zoom = 1;
var controls = new THREE.OrbitControls(camera);
controls.autoRotate = true;
controls.enablePan = false;
controls.enableKeys = false;

// Setup gui
var gui = new dat.GUI({'width': 280});
var folder = gui.addFolder('Settings');
folder.add(camera,'zoom',0.5,2,0.01);
folder.add(controls,'autoRotate');
folder.open();
gui.close();

// Setup raycaster
var raycaster = new THREE.Raycaster();

// Track mouse
var mouse = new THREE.Vector2();
function onMouseMove(event) {
    mouse.x = (event.clientX/$('.main-block').width())*2-1;
    mouse.y = -(event.clientY/$('.main-block').height())*2+1;
}
window.addEventListener('mousemove',onMouseMove,false);

// Make pial geometry for each hemisphere
var left_pial = make_pial_geometry(lhdata,'L');
var right_pial = make_pial_geometry(rhdata,'R');
left_pial.translate(20,-10,0);
right_pial.translate(20,-10,0);
var material0 = new THREE.MeshLambertMaterial({
    vertexColors: THREE.VertexColors
});
var material1 = new THREE.MeshLambertMaterial({
    vertexColors: THREE.VertexColors,
    emissive: 0xFFFFFF,
    emissiveIntensity: 0.125
});
scene.add(new THREE.Mesh(left_pial,[material0,material1]));
scene.add(new THREE.Mesh(right_pial,[material0,material1]));

function render_loop() {
    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        camera.updateProjectionMatrix();
        render();
    }
    animate();
}

// Render function
var previousnet = '';
function render() {
    raycaster.setFromCamera(mouse,camera);
    var intersects = raycaster.intersectObjects(scene.children);
    try {
        var label = intersects[0].face.network;
        $('.region-display').html(label+' Network');
        // set regions with label to material 1
        for (var i = 0; i < left_pial.faces.length; i++) {
            if (left_pial.faces[i].network === label) {
                left_pial.faces[i].materialIndex = 1;
            }
            else { // everything else to 0
                left_pial.faces[i].materialIndex = 0;
            }
        }
        for (var i = 0; i < right_pial.faces.length; i++) {
            if (right_pial.faces[i].network === label) {
                right_pial.faces[i].materialIndex = 1;
            }
            else { // everything else to 0
                right_pial.faces[i].materialIndex = 0;
            }
        }
    }
    catch (err) {
        for (var i = 0; i < left_pial.faces.length; i++) {
            left_pial.faces[i].materialIndex = 0;
        }
        for (var i = 0; i < right_pial.faces.length; i++) {
            right_pial.faces[i].materialIndex = 0;
        }
        $('.region-display').html('');
    }
    left_pial.groupsNeedUpdate = true;
    right_pial.groupsNeedUpdate = true;
    renderer.render(scene,camera);
}

// resize renderer and camera on window resize
$(window).resize(function() {
    camera.aspect = ($('.main-block').width()*w)/($('.main-block').height()*h);
    camera.updateProjectionMatrix();
    renderer.setSize($('.main-block').width(),$('.main-block').height());
});

render_loop();

// Draw pial surface geometry
function make_pial_geometry(pialdata,hemi) {
    // Setup Geometry
    var geometry = new THREE.Geometry();
    for (var i = 0; i < pialdata.vertices.length; i++) {
        // Define vertices
        geometry.vertices.push(
            new THREE.Vector3(
                pialdata.vertices[i][1],
                pialdata.vertices[i][2],
                pialdata.vertices[i][0]
            )
        );
    }
    for (var i = 0; i < pialdata.faces.length; i++) {
    	// get color for each vertex
    	var color0 = colortable[hemi][pialdata.faces[i][0]]["Color"];
    	var color1 = colortable[hemi][pialdata.faces[i][1]]["Color"];
    	var color2 = colortable[hemi][pialdata.faces[i][2]]["Color"];
        if (color0 === null) { color0 = [0.25,0.25,0.25]; }
        if (color1 === null) { color1 = [0.25,0.25,0.25]; };
        if (color2 === null) { color2 = [0.25,0.25,0.25]; };
        // Define faces
        geometry.faces.push(
            new THREE.Face3(
                pialdata.faces[i][1],
                pialdata.faces[i][2],
                pialdata.faces[i][0],
                null,
                [
                    new THREE.Color(color1[0],color1[1],color1[2]),
                    new THREE.Color(color2[0],color2[1],color2[2]),
                    new THREE.Color(color0[0],color0[1],color0[2]),
                ]
            )
        )
        // assign network name to face
        if (colortable[hemi][pialdata.faces[i][0]]["Network"] === null){
            var name = 'N/A';
        }
        else {
            var name = colortable[hemi][pialdata.faces[i][0]]["Network"];
        }
        geometry.faces[i].network = name;
    }
    // compute vertex and face normals
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    // return geometry
    return geometry;
}

// three.js array vertex order
function remap(array) {
    two = array[0];
    one = array[2];
    zero = array[1];
    return [zero,one,two];
}
