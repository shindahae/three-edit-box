
// 기본 세팅
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 주변 조명
const ambientlight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientlight);

// Shape 정의 (예: 원)
const shape = new THREE.Shape();
shape.moveTo(1, 1, 1);
shape.lineTo(1, 0, 1);
shape.lineTo(0, 0, 1);
shape.lineTo(0, 1, 1);
shape.lineTo(1, 1, 1);

// Shape의 geometry 생성
const geometry = new THREE.ShapeGeometry(shape);

// Mesh 생성 및 Scene에 추가
/* const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); */
const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,  // 색상 설정
            opacity: 0.5,     // 반투명도 설정
            transparent: true // 투명하게 설정
        });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Shape의 vertex를 표시하기 위한 Points 생성
const pointsMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.2 });
const pointsGeometry = new THREE.BufferGeometry().setFromPoints(geometry.vertices);
const points = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(points);

// 카메라 위치 설정
camera.position.z = 5;

// 마우스 이벤트 리스너 추가
let hovered = false;

/* renderer.domElement.addEventListener('mousemove', onMouseMove, false);
renderer.domElement.addEventListener('mouseout', onMouseOut, false);

function onMouseMove(event) {
    event.preventDefault();
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects([points]);
    
    if (intersects.length > 0) {
        hovered = true;
        points.material.size = 0.2; // points의 크기를 0.2로 설정
        points.material.needsUpdate = true; // material 업데이트 필요
    } else if (hovered) {
        hovered = false;
        points.material.size = 0.05; // 원래의 크기로 되돌림
        points.material.needsUpdate = true; // material 업데이트 필요
    }
}

function onMouseOut(event) {
    hovered = false;
    points.material.size = 0.05; // 원래의 크기로 되돌림
    points.material.needsUpdate = true; // material 업데이트 필요
} */

// 선택한 vertex의 인덱스 저장을 위한 변수
let selectedVertexIndex = null;

// 마우스 이벤트 리스너 추가
renderer.domElement.addEventListener('mousedown', onMouseDown, false);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);
renderer.domElement.addEventListener('mouseup', onMouseUp, false);

function onMouseDown(event) {
    event.preventDefault();
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObject(points);
    
    if (intersects.length > 0) {
        selectedVertexIndex = intersects[0].index;
    }
}

function updateShapeGeometry(newVertexPosition) {
    // 선택한 vertex를 새로운 위치로 이동
    geometry.vertices[selectedVertexIndex].set(newVertexPosition.x, newVertexPosition.y, 0);
    geometry.verticesNeedUpdate = true;  // vertices 업데이트 필요
    geometry.elementsNeedUpdate = true;  // elements 업데이트 필요
    geometry.computeBoundingSphere();     // bounding sphere 재계산
}

function onMouseMove(event) {
    event.preventDefault();
    
    if (selectedVertexIndex !== null) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);
        
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);  // z = 0 평면
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersection);  // 평면과의 교점 계산
        
         // 선택한 vertex를 새로운 위치로 이동
        pointsGeometry.attributes.position.setXYZ(selectedVertexIndex, intersection.x, intersection.y, 0);
        pointsGeometry.attributes.position.needsUpdate = true;  // position 속성 업데이트
        
        // 선택한 vertex를 새로운 위치로 이동
        updateShapeGeometry(intersection);
    }
}

function onMouseUp(event) {
    selectedVertexIndex = null;
}

// 애니메이션 함수
const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

// 애니메이션 시작
animate();
