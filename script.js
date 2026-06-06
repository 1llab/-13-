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
