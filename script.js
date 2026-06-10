let tomatoViewer = null;

function toggleCard(selectedCard) {
    const isAlreadyActive = selectedCard.classList.contains('active');
    const allCards = document.querySelectorAll('.card');

    allCards.forEach(card => card.classList.remove('active'));
    document.querySelectorAll('.pepper-flip-card.flipped').forEach(card => card.classList.remove('flipped'));
    document.querySelectorAll('.photo-stack.is-flying').forEach(stack => stack.classList.remove('is-flying'));
    stopTomato3D();

    if (isAlreadyActive) {
        return;
    }

    selectedCard.classList.add('active');

    if (selectedCard.querySelector('#tomato-3d')) {
        requestAnimationFrame(() => {
            initTomato3D();
            startTomato3D();
        });
    }
}

function burstEmoji(event) {
    event.stopPropagation();

    const emojiCount = 13;
    const emojiType = '🥔';
    const clickX = event.clientX;
    const clickY = event.clientY;

    for (let i = 0; i < emojiCount; i++) {
        const emoji = document.createElement('div');
        emoji.classList.add('burst-emoji');
        emoji.innerText = emojiType;
        emoji.style.left = `${clickX}px`;
        emoji.style.top = `${clickY}px`;

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 160 + 80;
        emoji.style.setProperty('--x', `${Math.cos(angle) * velocity}px`);
        emoji.style.setProperty('--y', `${Math.sin(angle) * velocity}px`);

        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 800);
    }
}
function flipPepperImage(event) {
    event.stopPropagation();
    event.currentTarget.classList.toggle('flipped');
}
function throwStackPhoto(event) {
    event.stopPropagation();

    const stack = event.currentTarget;
    if (stack.classList.contains('is-flying')) return;

    stack.classList.add('is-flying');
    setTimeout(() => {
        stack.classList.remove('is-flying');
    }, 950);
}
function dropCornGrains(event) {
    event.stopPropagation();

    const slide = event.currentTarget.closest('.grain-slide');
    const field = slide?.querySelector('.grain-field');
    if (!field) return;

    const fieldRect = field.getBoundingClientRect();
    const grainCount = 32;
    const currentCount = Number(field.dataset.grainCount || 0);
    const columns = Math.max(18, Math.floor(fieldRect.width / 34));

    for (let i = 0; i < grainCount; i++) {
        const grain = document.createElement('span');
        grain.className = 'corn-grain';

        const index = currentCount + i;
        const column = (index * 7 + Math.floor(Math.random() * 5)) % columns;
        const row = Math.floor(index / columns);
        const endX = 24 + column * ((fieldRect.width - 48) / columns) + Math.random() * 12;
        const endY = Math.max(80, fieldRect.height - 30 - row * 7 - Math.random() * 7);
        const startX = endX;
        const rotation = Math.random() * 720 - 360;
        const delay = Math.random() * 0.28;
        const duration = 0.95 + Math.random() * 0.45;

        grain.style.setProperty('--start-x', `${startX}px`);
        grain.style.setProperty('--mid-x', `${endX}px`);
        grain.style.setProperty('--end-x', `${endX}px`);
        grain.style.setProperty('--end-y', `${endY}px`);
        grain.style.setProperty('--rotation', `${rotation}deg`);
        grain.style.animationDelay = `${delay}s`;
        grain.style.animationDuration = `${duration}s`;

        field.appendChild(grain);
    }

    field.dataset.grainCount = String(currentCount + grainCount);
}

function initTomato3D() {
    const container = document.getElementById('tomato-3d');
    if (!container || tomatoViewer) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;

    renderer.domElement.addEventListener('mousedown', event => event.stopPropagation());
    renderer.domElement.addEventListener('mouseup', event => event.stopPropagation());
    renderer.domElement.addEventListener('click', event => event.stopPropagation());

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-5, 5, -5);
    scene.add(dirLight2);

    const viewer = {
        animationId: null,
        camera,
        container,
        controls,
        renderer,
        scene,
        tomato: null,
        running: false
    };

    tomatoViewer = viewer;

    const loader = new THREE.GLTFLoader();
    loader.load('cover2.glb', gltf => {
        viewer.tomato = gltf.scene;
        viewer.tomato.scale.set(1.5, 1.5, 1.5);
        viewer.tomato.position.set(0, 0, 0);
        scene.add(viewer.tomato);
        renderTomatoFrame();
    }, undefined, error => {
        console.error('3D 오류 났음', error);
    });

    window.addEventListener('resize', resizeTomato3D);
}

function startTomato3D() {
    if (!tomatoViewer || tomatoViewer.running) return;

    tomatoViewer.running = true;
    animateTomato3D();
}

function stopTomato3D() {
    if (!tomatoViewer) return;

    tomatoViewer.running = false;
    if (tomatoViewer.animationId) {
        cancelAnimationFrame(tomatoViewer.animationId);
        tomatoViewer.animationId = null;
    }
}

function animateTomato3D() {
    if (!tomatoViewer || !tomatoViewer.running) return;

    tomatoViewer.animationId = requestAnimationFrame(animateTomato3D);

    if (tomatoViewer.tomato) {
        tomatoViewer.tomato.rotation.y += 0.005;
    }

    tomatoViewer.controls.update();
    renderTomatoFrame();
}

function renderTomatoFrame() {
    if (!tomatoViewer) return;
    tomatoViewer.renderer.render(tomatoViewer.scene, tomatoViewer.camera);
}

function resizeTomato3D() {
    if (!tomatoViewer) return;

    const width = tomatoViewer.container.clientWidth || 300;
    const height = tomatoViewer.container.clientHeight || 400;
    tomatoViewer.camera.aspect = width / height;
    tomatoViewer.camera.updateProjectionMatrix();
    tomatoViewer.renderer.setSize(width, height);
    renderTomatoFrame();
}


