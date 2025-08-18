// 카카오맵 API 연동
class KakaoMapHandler {
    constructor() {
        this.map = null;
        this.marker = null;
        this.weddingLocation = {
            name: '웨딩시티 신도림 아모르홀',
            address: '서울특별시 구로구 새말로 97 신도림 테크노마트 8층',
            lat: 37.50701174253426, // 웨딩시티 신도림 정확한 좌표
            lng: 126.89020234539794
        };
        
        this.init();
    }
    
    init() {
        // DOM 로드 완료 후 지도 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initMap();
            });
        } else {
            this.initMap();
        }
    }
    
    initMap() {
        // 카카오맵 API가 로드되었는지 확인
        if (typeof kakao === 'undefined') {
            console.error('Kakao Maps API is not loaded');
            this.showMapError();
            return;
        }
        
        // 지도 컨테이너 확인
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }
        
        try {
            // 지도 옵션 설정
            const mapOption = {
                center: new kakao.maps.LatLng(this.weddingLocation.lat, this.weddingLocation.lng),
                level: 3, // 확대 레벨
                mapTypeId: kakao.maps.MapTypeId.ROADMAP
            };
            
            // 지도 생성
            this.map = new kakao.maps.Map(mapContainer, mapOption);
            
            // 마커 생성 및 표시
            this.createMarker();
            
            // 인포윈도우 생성
            this.createInfoWindow();
            
            // 지도 컨트롤 추가
            this.addMapControls();
            
            // 지도 중심을 정확한 위치로 재설정
            this.map.setCenter(new kakao.maps.LatLng(this.weddingLocation.lat, this.weddingLocation.lng));
            
            console.log('Kakao Map initialized successfully');
            
        } catch (error) {
            console.error('Map initialization failed:', error);
            this.showMapError();
        }
    }
    
    createMarker() {
        // 마커 이미지 설정 (커스텀 마커 사용 시)
        const markerImageSrc = 'images/icons/wedding-marker.png'; // 커스텀 마커 이미지
        const markerImageSize = new kakao.maps.Size(40, 45);
        const markerImageOption = { offset: new kakao.maps.Point(20, 45) };
        
        let markerImage;
        
        // 커스텀 마커 이미지가 있는지 확인
        const img = new Image();
        img.onload = () => {
            markerImage = new kakao.maps.MarkerImage(markerImageSrc, markerImageSize, markerImageOption);
            this.createMarkerWithImage(markerImage);
        };
        img.onerror = () => {
            // 기본 마커 사용
            this.createMarkerWithImage(null);
        };
        img.src = markerImageSrc;
    }
    
    createMarkerWithImage(markerImage) {
        const markerPosition = new kakao.maps.LatLng(this.weddingLocation.lat, this.weddingLocation.lng);
        
        const markerOptions = {
            position: markerPosition
        };
        
        if (markerImage) {
            markerOptions.image = markerImage;
        }
        
        this.marker = new kakao.maps.Marker(markerOptions);
        this.marker.setMap(this.map);
        
        // 마커 클릭 이벤트
        kakao.maps.event.addListener(this.marker, 'click', () => {
            this.onMarkerClick();
        });
    }
    
    createInfoWindow() {
        const infoContent = `
            <div style="padding:10px; min-width:200px; text-align:center;">
                <strong style="display:block; margin-bottom:5px; color:#8B4F92;">
                    ${this.weddingLocation.name}
                </strong>
                <div style="font-size:12px; color:#666; margin-bottom:8px;">
                    ${this.weddingLocation.address}
                </div>
                <div style="margin-top:8px;">
                    <a href="https://map.kakao.com/link/to/${this.weddingLocation.name},${this.weddingLocation.lat},${this.weddingLocation.lng}" 
                       target="_blank" 
                       style="display:inline-block; padding:4px 8px; background:#FEE500; color:#000; text-decoration:none; border-radius:3px; font-size:11px;">
                        길찾기
                    </a>
                </div>
            </div>
        `;
        
        this.infoWindow = new kakao.maps.InfoWindow({
            content: infoContent,
            removable: true
        });
        
        // 마커에 인포윈도우 표시
        this.infoWindow.open(this.map, this.marker);
    }
    
    addMapControls() {
        // 지도 타입 컨트롤 추가
        const mapTypeControl = new kakao.maps.MapTypeControl();
        this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        
        // 줌 컨트롤 추가
        const zoomControl = new kakao.maps.ZoomControl();
        this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    }
    
    onMarkerClick() {
        // 마커 클릭 시 지도 중심을 마커 위치로 이동
        this.map.setCenter(this.marker.getPosition());
        
        // 인포윈도우 토글
        if (this.infoWindow.getMap()) {
            this.infoWindow.close();
        } else {
            this.infoWindow.open(this.map, this.marker);
        }
    }
    
    showMapError() {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#666;">
                    <div style="font-size:48px; margin-bottom:16px;">🗺️</div>
                    <p style="margin:0; text-align:center; line-height:1.5;">
                        지도를 불러올 수 없습니다.<br>
                        아래 버튼을 통해 위치를 확인해주세요.
                    </p>
                </div>
            `;
        }
    }
    
    // 지도 크기 재조정 (반응형 대응)
    resizeMap() {
        if (this.map) {
            this.map.relayout();
        }
    }
    
    // 특정 위치로 지도 이동
    moveToLocation(lat, lng, level = 3) {
        if (this.map) {
            const moveLatLon = new kakao.maps.LatLng(lat, lng);
            this.map.setCenter(moveLatLon);
            this.map.setLevel(level);
        }
    }
    
    // 교통정보 토글
    toggleTraffic() {
        if (this.map) {
            // 교통정보 레이어 토글 구현
            console.log('Traffic toggle - to be implemented');
        }
    }
    
    // 인스턴스 정리
    destroy() {
        if (this.infoWindow) {
            this.infoWindow.close();
        }
        if (this.map) {
            // 이벤트 리스너 제거 등 정리 작업
            this.map = null;
        }
    }
}

// 전역 지도 인스턴스
let kakaoMapHandler;

// 지도 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 카카오맵 API 로드 확인 후 초기화
    if (typeof kakao !== 'undefined') {
        kakao.maps.load(() => {
            kakaoMapHandler = new KakaoMapHandler();
        });
    } else {
        console.error('Kakao Maps API not loaded');
        // 에러 표시
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#666;">
                    <div style="font-size:48px; margin-bottom:16px;">🗺️</div>
                    <p style="margin:0; text-align:center; line-height:1.5;">
                        지도 API를 불러올 수 없습니다.<br>
                        <small>API 키를 확인해주세요.</small>
                    </p>
                </div>
            `;
        }
    }
});

// 윈도우 리사이즈 시 지도 크기 재조정
window.addEventListener('resize', () => {
    if (kakaoMapHandler) {
        setTimeout(() => {
            kakaoMapHandler.resizeMap();
        }, 100);
    }
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (kakaoMapHandler) {
        kakaoMapHandler.destroy();
    }
});