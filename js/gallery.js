// 갤러리 Swiper 설정 및 관리
class WeddingGallery {
    constructor() {
        this.swiper = null;
        this.init();
    }
    
    init() {
        // DOM이 로드된 후 Swiper 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initSwiper();
            });
        } else {
            this.initSwiper();
        }
    }
    
    initSwiper() {
        // Swiper 라이브러리가 로드되었는지 확인
        if (typeof Swiper === 'undefined') {
            console.error('Swiper library is not loaded');
            return;
        }
        
        // Swiper 인스턴스 생성
        this.swiper = new Swiper('.gallery-swiper', {
            // 기본 설정
            loop: true,
            centeredSlides: true,
            slidesPerView: 1,
            spaceBetween: 20,
            
            // 자동 재생
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            
            // 페이지네이션
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            
            // 네비게이션 버튼
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // 터치/마우스 조작
            touchRatio: 1,
            touchAngle: 45,
            grabCursor: true,
            
            // 키보드 조작
            keyboard: {
                enabled: true,
                onlyInViewport: false,
            },
            
            // 마우스휠 조작
            mousewheel: {
                enabled: false
            },
            
            // 효과 설정
            effect: 'slide',
            
            // 반응형 브레이크포인트
            breakpoints: {
                // 768px 이상
                768: {
                    slidesPerView: 1.2,
                    spaceBetween: 30,
                    centeredSlides: true
                },
                // 1024px 이상
                1024: {
                    slidesPerView: 1.5,
                    spaceBetween: 40,
                    centeredSlides: true
                }
            },
            
            // 이벤트 핸들러
            on: {
                init: () => {
                    this.onSwiperInit();
                },
                slideChange: () => {
                    this.onSlideChange();
                },
                touchStart: () => {
                    this.onTouchStart();
                },
                touchEnd: () => {
                    this.onTouchEnd();
                }
            }
        });
        
        // 이미지 지연 로딩 설정
        this.setupLazyLoading();
        
        // 라이트박스 기능 추가
        this.setupLightbox();
    }
    
    onSwiperInit() {
        console.log('Gallery Swiper initialized');
        
        // 초기 로딩 애니메이션
        const swiperContainer = document.querySelector('.gallery-swiper');
        if (swiperContainer) {
            swiperContainer.style.opacity = '0';
            swiperContainer.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                swiperContainer.style.transition = 'all 0.5s ease';
                swiperContainer.style.opacity = '1';
                swiperContainer.style.transform = 'translateY(0)';
            }, 100);
        }
    }
    
    onSlideChange() {
        // 슬라이드 변경 시 실행할 코드
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide) {
            const img = activeSlide.querySelector('img');
            if (img && !img.complete) {
                img.style.filter = 'blur(5px)';
                img.onload = () => {
                    img.style.filter = 'none';
                    img.style.transition = 'filter 0.3s ease';
                };
            }
        }
    }
    
    onTouchStart() {
        // 터치 시작 시 자동 재생 일시 정지
        if (this.swiper && this.swiper.autoplay) {
            this.swiper.autoplay.stop();
        }
    }
    
    onTouchEnd() {
        // 터치 종료 후 자동 재생 재시작
        if (this.swiper && this.swiper.autoplay) {
            setTimeout(() => {
                this.swiper.autoplay.start();
            }, 3000);
        }
    }
    
    setupLazyLoading() {
        // 이미지 지연 로딩 구현
        const images = document.querySelectorAll('.gallery-swiper img');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('src');
                    
                    if (src && !img.complete) {
                        img.style.opacity = '0';
                        img.onload = () => {
                            img.style.transition = 'opacity 0.3s ease';
                            img.style.opacity = '1';
                        };
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    setupLightbox() {
        // 간단한 라이트박스 기능
        const slides = document.querySelectorAll('.gallery-swiper .swiper-slide');
        
        slides.forEach(slide => {
            slide.addEventListener('click', (e) => {
                if (e.target.tagName === 'IMG') {
                    this.openLightbox(e.target.src, e.target.alt);
                }
            });
        });
    }
    
    openLightbox(src, alt) {
        // 라이트박스 엘리먼트 생성
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-container">
                <img src="${src}" alt="${alt}" class="lightbox-image">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        
        // 스타일 적용
        const style = document.createElement('style');
        style.textContent = `
            .lightbox-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            }
            
            .lightbox-container {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            
            .lightbox-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
            }
            
            .lightbox-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 5px;
                line-height: 1;
            }
            
            .lightbox-close:hover {
                opacity: 0.7;
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
            }
        `;
        
        if (!document.querySelector('.lightbox-styles')) {
            style.className = 'lightbox-styles';
            document.head.appendChild(style);
        }
        
        // DOM에 추가
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // 이벤트 리스너
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.className === 'lightbox-close') {
                this.closeLightbox(lightbox);
            }
        });
        
        // ESC 키로 닫기
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox(lightbox);
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
    }
    
    closeLightbox(lightbox) {
        lightbox.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            if (lightbox && lightbox.parentNode) {
                lightbox.parentNode.removeChild(lightbox);
            }
            document.body.style.overflow = '';
        }, 300);
        
        // fadeOut 애니메이션 추가
        const style = document.querySelector('.lightbox-styles');
        if (style && !style.textContent.includes('fadeOut')) {
            style.textContent += `
                @keyframes fadeOut {
                    to { opacity: 0; }
                }
            `;
        }
    }
    
    // 인스턴스 정리
    destroy() {
        if (this.swiper) {
            this.swiper.destroy(true, true);
            this.swiper = null;
        }
    }
    
    // 특정 슬라이드로 이동
    goToSlide(index) {
        if (this.swiper) {
            this.swiper.slideTo(index);
        }
    }
    
    // 자동 재생 토글
    toggleAutoplay() {
        if (this.swiper && this.swiper.autoplay) {
            if (this.swiper.autoplay.running) {
                this.swiper.autoplay.stop();
            } else {
                this.swiper.autoplay.start();
            }
        }
    }
}

// 전역 갤러리 인스턴스
let weddingGallery;

// DOM 로드 완료 후 갤러리 초기화
document.addEventListener('DOMContentLoaded', function() {
    weddingGallery = new WeddingGallery();
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (weddingGallery) {
        weddingGallery.destroy();
    }
});