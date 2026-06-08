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
