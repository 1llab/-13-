function toggleCard(selectedCard) {
    // 만약 이미 열려있는 카드를 다시 누른 것이라면 닫아줍니다.
    if (selectedCard.classList.contains('active')) {
        selectedCard.classList.remove('active');
    } else {
        // 다른 카드들이 열려있다면 모두 닫고 현재 카드만 엽니다.
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => card.classList.remove('active'));

        // 선택한 카드 전체화면 활성화
        selectedCard.classList.add('active');
    }
}

function burstEmoji(event) {
    // 이벤트가 상위 카드 기능으로 퍼져서 화면이 닫히는 것을 방지
    event.stopPropagation();

    const emojiCount = 13; // 한 번에 튀어나올 이모지 개수
    const emojiType = '🥔'; // ★ 원하는 특정 이모지로 변경 가능!

    // 마우스로 클릭한 현재 위치 좌표 가져오기
    const clickX = event.clientX;
    const clickY = event.clientY;

    for (let i = 0; i < emojiCount; i++) {
        // 이모지 엘리먼트 생성
        const emoji = document.createElement('div');
        emoji.classList.add('burst-emoji');
        emoji.innerText = emojiType;

        // 클릭한 위치에 이모지 배치
        emoji.style.left = `${clickX}px`;
        emoji.style.top = `${clickY}px`;

        // 사방으로 흩어질 랜덤한 거리와 방향 계산 (수치를 키우면 더 멀리 튐)
        const angle = Math.random() * Math.PI * 2; // 360도 랜덤 방향
        const velocity = Math.random() * 200 + 100; // 날아갈 거리 (50px ~ 200px)

        const xFactor = Math.cos(angle) * velocity;
        const yFactor = Math.sin(angle) * velocity;

        // CSS 애니메이션 변수로 전달
        emoji.style.setProperty('--x', `${xFactor}px`);
        emoji.style.setProperty('--y', `${yFactor}px`);

        // 화면에 추가
        document.body.appendChild(emoji);

        // 애니메이션이 끝나면 메모리를 위해 이모지 삭제
        setTimeout(() => {
            emoji.remove();
        }, 800);
    }
}

//토마토
function initTomato3D() {
    const container = document.getElementById('tomato-3d');
    if (!container || container.children.length > 0) return;

    // 1. Scene, 카메라, 렌더러 설정 (기존과 동일)
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5); // 카메라 위치 조정

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 2. 마우스 컨트롤 및 이벤트 차단 (기존과 동일)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;

    renderer.domElement.addEventListener('mousedown', (e) => e.stopPropagation());
    renderer.domElement.addEventListener('mouseup', (e) => e.stopPropagation());
    renderer.domElement.addEventListener('click', (e) => e.stopPropagation());

    // 3. 조명 설정 (외부 파일은 조명이 좋아야 색이 예쁘게 나옵니다)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-5, 5, -5);
    scene.add(dirLight2);

    // ★ 4. 진짜 토마토 3D 파일 불러오기
    let realTomato; // 애니메이션 함수에서 쓰기 위해 변수 선언
    const loader = new THREE.GLTFLoader();

    // 'tomato.glb' 자리에 다운받은 파일 경로와 이름을 정확히 적어주세요.
    loader.load('cover2.glb', function (gltf) {
        realTomato = gltf.scene;

        // 3D 파일 크기가 너무 작거나 크게 나올 때 크기 조절 (0.5배, 2배 등 조정 가능)
        realTomato.scale.set(1.5, 1.5, 1.5);

        // 토마토 화면 중앙 배치
        realTomato.position.set(0, 0, 0);

        scene.add(realTomato);
    }, undefined, function (error) {
        console.error('3D 파일을 불러오는 중 오류 발생:', error);
    });

    // 5. 애니메이션 루프
    function animate() {
        requestAnimationFrame(animate);

        // 파일이 완전히 로드된 후에만 자동 회전 작동
        if (realTomato) {
            realTomato.rotation.y += 0.005;
        }

        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}
