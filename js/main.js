// 메인 JavaScript 기능들
class WeddingInvitation {
    constructor() {
        this.init();
    }
    
    init() {
        // DOM 로드 완료 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.initializeFeatures();
            });
        } else {
            this.setupEventListeners();
            this.initializeFeatures();
        }
    }
    
    setupEventListeners() {
        // 계좌번호 복사 기능
        this.setupAccountCopy();
        
        // 공유 기능
        this.setupShareFeatures();
        
        // 스크롤 효과
        this.setupScrollEffects();
        
        // 부드러운 스크롤 네비게이션
        this.setupSmoothScroll();
        
        // 이미지 최적화
        this.setupImageOptimization();
    }
    
    initializeFeatures() {
        // AOS (Animate On Scroll) 초기화
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                delay: 100,
                once: true,
                offset: 100
            });
        }
        
        // 메인 커버 텍스트 지연 로딩
        this.setupCoverTextDelayedLoading();
        
        // 페이지 로딩 애니메이션
        this.showPageContent();
        
        // 카카오 SDK 초기화
        this.initKakaoSDK();
    }
    
    setupAccountCopy() {
        // 계좌번호 복사 버튼 이벤트
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                e.preventDefault();
                const accountElement = e.target.closest('.account-number');
                const accountNumber = accountElement.getAttribute('data-account');
                
                this.copyToClipboard(accountNumber, e.target);
            }
        });
    }
    
    async copyToClipboard(text, button) {
        try {
            // 현대적인 Clipboard API 사용
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // 폴백: 전통적인 방법
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            
            // 성공 피드백
            this.showCopySuccess(button);
            
        } catch (err) {
            console.error('복사 실패:', err);
            this.showCopyError(button);
        }
    }
    
    showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = '복사됨!';
        button.style.background = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
    
    showCopyError(button) {
        const originalText = button.textContent;
        button.textContent = '실패';
        button.style.background = '#f44336';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
    
    setupShareFeatures() {
        // 카카오톡 공유
        window.shareKakao = () => {
            this.shareKakao();
        };
        
        // 링크 복사
        window.copyLink = () => {
            this.copyLink();
        };
    }
    
    initKakaoSDK() {
        // 카카오 JavaScript 키 설정 (실제 앱 키로 교체 필요)
        if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
            try {
                // 실제 카카오 앱 JavaScript 키로 교체하세요
                Kakao.init('1c6879c50b5abdf882792a6020930ba6');
                console.log('Kakao SDK initialized');
            } catch (error) {
                console.error('Kakao SDK initialization failed:', error);
            }
        }
    }
    
    shareKakao() {
        if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
            alert('카카오톡 공유 기능을 사용할 수 없습니다.');
            return;
        }
        
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '[현국♥수민] 결혼합니다',
                description: '2026년 4월 4일 토요일 오후 1시 20분\n웨딩시티 신도림 아모르홀에서 열리는 결혼식에 초대합니다.',
                imageUrl: window.location.origin + '/images/cover/main-cover.jpeg',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: '청첩장 보기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    }
    
    async copyLink() {
        try {
            await this.copyToClipboard(window.location.href);
            
            // 토스트 메시지 표시
            this.showToast('링크가 복사되었습니다!');
            
        } catch (err) {
            console.error('링크 복사 실패:', err);
            this.showToast('링크 복사에 실패했습니다.', 'error');
        }
    }
    
    showToast(message, type = 'success') {
        // 토스트 메시지 엘리먼트 생성
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // 스타일 적용
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                border-radius: 25px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: toastSlideIn 0.3s ease;
            }
            
            .toast-success {
                background: #4CAF50;
            }
            
            .toast-error {
                background: #f44336;
            }
            
            @keyframes toastSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            @keyframes toastSlideOut {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        
        if (!document.querySelector('.toast-styles')) {
            style.className = 'toast-styles';
            document.head.appendChild(style);
        }
        
        // DOM에 추가
        document.body.appendChild(toast);
        
        // 3초 후 제거
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => {
                if (toast && toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    setupScrollEffects() {
        // 스크롤에 따른 효과 처리
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            
            // 메인 커버 섹션에서의 스크롤 처리
            if (scrollTop < windowHeight) {
                this.handleCoverScroll(scrollTop, windowHeight);
            }
            
            // 스크롤 방향에 따른 처리
            if (scrollTop > lastScrollTop) {
                // 아래로 스크롤
                this.onScrollDown();
            } else {
                // 위로 스크롤
                this.onScrollUp();
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, { passive: true });
    }
    
    handleCoverScroll(scrollTop, windowHeight) {
        // 메인 커버에서의 스크롤 진행 상황 처리
        const scrollProgress = scrollTop / windowHeight;
        
        // 스크롤이 충분히 진행되면 다음 섹션으로 부드럽게 이동 유도
        if (scrollProgress > 0.8) {
            // 80% 이상 스크롤하면 다음 섹션 힌트 표시 등의 처리 가능
            this.showNextSectionHint();
        }
    }
    
    showNextSectionHint() {
        // 다음 섹션으로의 이동을 유도하는 시각적 힌트
        // 예: 아래 화살표 표시, 살짝 다음 섹션 미리보기 등
    }
    
    onScrollDown() {
        // 아래로 스크롤할 때의 효과
    }
    
    onScrollUp() {
        // 위로 스크롤할 때의 효과
    }
    
    setupSmoothScroll() {
        // 앵커 링크에 부드러운 스크롤 적용
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupImageOptimization() {
        // 이미지 지연 로딩 및 최적화
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // IntersectionObserver 미지원 시 폴백
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
    
    setupCoverTextDelayedLoading() {
        // 스크롤 기반 메인 커버 텍스트 인터랙션
        const coverSection = document.querySelector('#main-cover');
        const coverContent = document.querySelector('.cover-content');
        const scrollHint = document.querySelector('#scrollHint');
        
        if (!coverSection || !coverContent) return;
        
        let isTextVisible = false;
        let isHintHidden = false;
        
        console.log('스크롤 힌트 초기화:', scrollHint ? '찾음' : '못찾음');
        
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const scrollProgress = Math.min(scrollY / (windowHeight * 0.3), 1);
            
            // 스크롤 힌트 처리 - 단순화
            if (scrollHint && scrollY > 10 && !isHintHidden) {
                console.log('스크롤 힌트 숨기기 - scrollY:', scrollY);
                scrollHint.classList.add('hide');
                isHintHidden = true;
            }
            
            // 텍스트 표시 처리
            if (scrollProgress > 0.1 && !isTextVisible) {
                console.log('텍스트 표시 - scrollProgress:', scrollProgress);
                coverContent.classList.add('show');
                isTextVisible = true;
            }
            
            // 스크롤 진행도에 따른 텍스트 위치 조정
            if (isTextVisible) {
                const translateY = Math.max(0, (1 - scrollProgress) * 20);
                coverContent.style.transform = `translateY(${translateY}px)`;
                coverContent.style.opacity = Math.min(1, scrollProgress * 3);
            }
        };
        
        // 스크롤 이벤트 리스너 추가 (쓰로틀링 적용)
        window.addEventListener('scroll', this.constructor.throttle(handleScroll, 16));
        
        // 초기 상태 체크
        handleScroll();
    }
    
    showPageContent() {
        // 페이지 로딩 완료 후 콘텐츠 표시
        document.body.style.opacity = '0';
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });
    }
    
    // 유틸리티 함수들
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// 전역 함수들 (HTML에서 직접 호출용)
window.copyAccount = function(button) {
    // 이미 main.js의 이벤트 리스너에서 처리됨
};

window.shareKakao = function() {
    // WeddingInvitation 클래스에서 처리됨
};

window.copyLink = function() {
    // WeddingInvitation 클래스에서 처리됨
};

// 앱 초기화
const weddingApp = new WeddingInvitation();