// D-day 카운트다운 기능
class WeddingCountdown {
    constructor(targetDate) {
        this.targetDate = new Date(targetDate);
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        
        this.init();
    }
    
    init() {
        // 초기 실행
        this.updateCountdown();
        
        // 1초마다 업데이트
        this.interval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;
        
        // 시간이 지난 경우
        if (distance < 0) {
            this.showWeddingDay();
            clearInterval(this.interval);
            return;
        }
        
        // 시간 계산
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // DOM 업데이트 (애니메이션 효과 포함)
        this.updateElement(this.elements.days, days);
        this.updateElement(this.elements.hours, hours);
        this.updateElement(this.elements.minutes, minutes);
        this.updateElement(this.elements.seconds, seconds);
    }
    
    updateElement(element, value) {
        const formattedValue = value.toString().padStart(2, '0');
        
        if (element && element.textContent !== formattedValue) {
            // 숫자 변경 애니메이션
            element.style.transform = 'scale(1.1)';
            element.style.opacity = '0.7';
            
            setTimeout(() => {
                element.textContent = formattedValue;
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
            }, 150);
        }
    }
    
    showWeddingDay() {
        // 결혼식 당일이 된 경우 메시지 변경
        const countdownContainer = document.querySelector('.countdown-container');
        if (countdownContainer) {
            countdownContainer.innerHTML = `
                <div class="wedding-day-message">
                    <h2>🎉 결혼식 당일입니다! 🎉</h2>
                    <p>축복해주셔서 감사합니다</p>
                </div>
            `;
            countdownContainer.style.animation = 'pulse 2s infinite';
        }
    }
    
    // 인스턴스 정리
    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// DOM 로드 완료 후 카운트다운 시작
document.addEventListener('DOMContentLoaded', function() {
    // 결혼식 날짜 설정 (예: 2025년 4월 4일 오후 1시 20분)
    const weddingDate = '2025-04-04T13:20:00';
    
    // 카운트다운 인스턴스 생성
    const countdown = new WeddingCountdown(weddingDate);
    
    // 페이지를 벗어날 때 정리
    window.addEventListener('beforeunload', () => {
        countdown.destroy();
    });
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    .countdown-number {
        transition: all 0.3s ease;
    }
    
    .wedding-day-message {
        text-align: center;
        color: white;
    }
    
    .wedding-day-message h2 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .wedding-day-message p {
        font-size: 1rem;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);