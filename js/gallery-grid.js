// 3x3 격자 갤러리 관리
class GalleryGrid {
    constructor() {
        this.isExpanded = false;
        this.toggleBtn = document.getElementById('galleryToggleBtn');
        this.hiddenItems = document.querySelectorAll('.gallery-hidden');
        this.allItems = document.querySelectorAll('.gallery-item');
        
        this.init();
    }
    
    init() {
        // 초기 설정
        this.setupEventListeners();
        this.setupLazyLoading();
        this.setupLightbox();
        
        // AOS 새로고침 (숨겨진 요소들이 있을 때)
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
    
    setupEventListeners() {
        // 더보기/접기 버튼 이벤트
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                this.toggleGallery();
            });
        }
    }
    
    toggleGallery() {
        this.isExpanded = !this.isExpanded;
        
        if (this.isExpanded) {
            this.showAllImages();
        } else {
            this.hideExtraImages();
        }
        
        this.updateButton();
        this.scrollToGallery();
    }
    
    showAllImages() {
        // 숨겨진 이미지들을 순차적으로 표시
        this.hiddenItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.remove('gallery-hidden');
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                // 애니메이션 적용
                setTimeout(() => {
                    item.style.transition = 'all 0.4s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
                
                // AOS 애니메이션 재적용
                if (typeof AOS !== 'undefined') {
                    AOS.refreshHard();
                }
            }, index * 100); // 순차적 애니메이션
        });
    }
    
    hideExtraImages() {
        // 추가 이미지들을 순차적으로 숨김
        const reversedItems = Array.from(this.hiddenItems).reverse();
        
        reversedItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    item.classList.add('gallery-hidden');
                    item.style.transform = '';
                    item.style.opacity = '';
                    item.style.transition = '';
                }, 300);
            }, index * 50);
        });
    }
    
    updateButton() {
        if (!this.toggleBtn) return;
        
        const btnText = this.toggleBtn.querySelector('.btn-text');
        const btnIcon = this.toggleBtn.querySelector('.btn-icon');
        
        if (this.isExpanded) {
            btnText.textContent = '접기';
            btnIcon.textContent = '▲';
            this.toggleBtn.classList.add('expanded');
        } else {
            btnText.textContent = '더보기';
            btnIcon.textContent = '▼';
            this.toggleBtn.classList.remove('expanded');
        }
    }
    
    scrollToGallery() {
        // 갤러리 섹션으로 부드럽게 스크롤
        if (this.isExpanded) {
            const gallerySection = document.getElementById('gallery');
            if (gallerySection) {
                setTimeout(() => {
                    gallerySection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 200);
            }
        }
    }
    
    setupLazyLoading() {
        // Intersection Observer를 사용한 지연 로딩
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // 이미지 로딩 시작
                        img.style.opacity = '0';
                        img.onload = () => {
                            img.style.transition = 'opacity 0.3s ease';
                            img.style.opacity = '1';
                        };
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            // 모든 갤러리 이미지에 observer 적용
            this.allItems.forEach(item => {
                const img = item.querySelector('img');
                if (img) {
                    imageObserver.observe(img);
                }
            });
        }
    }
    
    setupLightbox() {
        // 갤러리 아이템 클릭 시 라이트박스 열기
        this.allItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const img = item.querySelector('img');
                if (img) {
                    this.openLightbox(img.src, img.alt);
                }
            });
        });
    }
    
    openLightbox(src, alt) {
        // 라이트박스 엘리먼트 생성
        const lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <img src="${src}" alt="${alt}" class="lightbox-image">
                <button class="lightbox-close" aria-label="닫기">&times;</button>
                <div class="lightbox-nav">
                    <button class="lightbox-prev" aria-label="이전">‹</button>
                    <button class="lightbox-next" aria-label="다음">›</button>
                </div>
                <div class="lightbox-counter">
                    <span class="current-image"></span> / <span class="total-images"></span>
                </div>
            </div>
        `;
        
        // 스타일 적용
        this.addLightboxStyles();
        
        // 현재 이미지 인덱스 찾기
        const currentIndex = this.getCurrentImageIndex(src);
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // 이벤트 리스너 설정
        this.setupLightboxEvents(lightbox, currentIndex);
        
        // 초기 이미지 정보 업데이트
        this.updateLightboxInfo(lightbox, currentIndex);
        
        // 애니메이션
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
    }
    
    getCurrentImageIndex(src) {
        const visibleItems = this.isExpanded 
            ? this.allItems 
            : Array.from(this.allItems).filter(item => !item.classList.contains('gallery-hidden'));
            
        return Array.from(visibleItems).findIndex(item => {
            const img = item.querySelector('img');
            return img && img.src === src;
        });
    }
    
    setupLightboxEvents(lightbox, startIndex) {
        let currentIndex = startIndex;
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const overlay = lightbox.querySelector('.lightbox-overlay');
        
        // 닫기 이벤트
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            setTimeout(() => {
                if (lightbox.parentNode) {
                    lightbox.parentNode.removeChild(lightbox);
                }
                document.body.style.overflow = '';
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', closeLightbox);
        
        // 이전/다음 이미지
        const changeImage = (direction) => {
            const visibleItems = this.isExpanded 
                ? this.allItems 
                : Array.from(this.allItems).filter(item => !item.classList.contains('gallery-hidden'));
                
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % visibleItems.length;
            } else {
                currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            }
            
            const newImg = visibleItems[currentIndex].querySelector('img');
            const lightboxImg = lightbox.querySelector('.lightbox-image');
            
            // 이미지 전환 애니메이션
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = newImg.src;
                lightboxImg.alt = newImg.alt;
                lightboxImg.style.opacity = '1';
                this.updateLightboxInfo(lightbox, currentIndex);
            }, 150);
        };
        
        prevBtn.addEventListener('click', () => changeImage('prev'));
        nextBtn.addEventListener('click', () => changeImage('next'));
        
        // 키보드 이벤트
        const handleKeyPress = (e) => {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    changeImage('prev');
                    break;
                case 'ArrowRight':
                    changeImage('next');
                    break;
            }
        };
        
        document.addEventListener('keydown', handleKeyPress);
        
        // 라이트박스가 닫힐 때 이벤트 리스너 제거
        lightbox.addEventListener('remove', () => {
            document.removeEventListener('keydown', handleKeyPress);
        });
    }
    
    updateLightboxInfo(lightbox, currentIndex) {
        const currentSpan = lightbox.querySelector('.current-image');
        const totalSpan = lightbox.querySelector('.total-images');
        
        const visibleItems = this.isExpanded 
            ? this.allItems 
            : Array.from(this.allItems).filter(item => !item.classList.contains('gallery-hidden'));
            
        currentSpan.textContent = currentIndex + 1;
        totalSpan.textContent = visibleItems.length;
    }
    
    addLightboxStyles() {
        if (document.querySelector('.gallery-lightbox-styles')) return;
        
        const style = document.createElement('style');
        style.className = 'gallery-lightbox-styles';
        style.textContent = `
            .gallery-lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .lightbox-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
            }
            
            .lightbox-container {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .lightbox-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
                transition: opacity 0.3s ease;
            }
            
            .lightbox-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 2rem;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
            }
            
            .lightbox-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .lightbox-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 0 20px;
                pointer-events: none;
            }
            
            .lightbox-prev,
            .lightbox-next {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 2rem;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
                pointer-events: auto;
            }
            
            .lightbox-prev:hover,
            .lightbox-next:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .lightbox-counter {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.5);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9rem;
            }
            
            @media (max-width: 768px) {
                .lightbox-container {
                    padding: 10px;
                }
                
                .lightbox-close {
                    top: 10px;
                    right: 10px;
                    width: 40px;
                    height: 40px;
                    font-size: 1.5rem;
                }
                
                .lightbox-prev,
                .lightbox-next {
                    width: 40px;
                    height: 40px;
                    font-size: 1.5rem;
                }
                
                .lightbox-nav {
                    padding: 0 10px;
                }
                
                .lightbox-counter {
                    bottom: 10px;
                    font-size: 0.8rem;
                    padding: 6px 12px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// 전역 함수 (HTML에서 호출)
window.toggleGallery = function() {
    if (window.galleryGrid) {
        window.galleryGrid.toggleGallery();
    }
};

// DOM 로드 완료 후 갤러리 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.galleryGrid = new GalleryGrid();
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (window.galleryGrid) {
        window.galleryGrid = null;
    }
});