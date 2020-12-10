# 프론트엔드 최적화 강의 노트

## part 1

### 1. 블로그 사이트 최적화

### 1 lighthouse

**Categories** 검사할 항목 선택

**Device** 검사할 장치 환경 선택

**Generate report** 검사 시작

> 퍼포먼스, 베스트오브 프랙티스가 뭔 뜻일까?


**opportunities** -> 리소스 관점. 로딩 성능 최적화

**diagnostics** -> 실행 관점. 렌더링 성능 최적화

빨간색 항목은 반드시 고쳐야 할 것. 회색은 치명적이진 않지만 살펴보면 좋을 것.

**Runtime Setting** -> 검사 시 사용한 세팅

### 1-5)

오파츄너티

properly size images : 이미지를 적절히 압축해라. 어떤 이미지를 최적화해야 할지를 보여준다.

이미지는 보여지는 크기 만큼 줄여서 렌더링하는 게 좋다. 근데 요즘은 화질이 너무 좋아서 너비 *2배 정도를 해야 한다.  120 x 120이라면 240 x 240 정도로

static은 그냥 이미지를 줄여서 넣으면 된다.

API로 들어오는 건 CDN 등을 사용한다. (contents delivery network). 물리적 거리의 한계를 극복하기 위해 소비자와 가까운 위치에 서버를 위치하는 기술.

image provessing CDN 은? 이미지를 사용자에게 보내기 전에 사이즈를 변경하든 등의 중간 과정을 거쳐서 전달한다. 

```
imageCDN_URL?src=[이미지ㅕURL]width&height
```

직접 구축해도 되지만 imgix 라는 이미지 CDN 솔루션이 있다.

즉, 이미지를 화면에 나타낼 때는 필요한 크기 만큼, 혹은 그것에 두 배정도 곱한 만큼만 나타내야 한다. 이미지가 static이라면 이미지 크기 자체를 줄여서 업로드할 수 있고, 동적으로 가져오는 거라면 imageCDN 을 사용할 수 있다.

### 1-6) bottleneck

minify Javascript -> 자바스크립트 코드 중에 공백이나 주석을 제거해서 불필요한 부분을 제거해라

preconnent to required origins -> 건너 뛰어?




diagnotics 

minimize main-thread work -> 메인 스레드 작업을 줄여라.

serve static with cache policy -> 캐시를 이용해라.

Reduce Javascript execution time -> 자바스크립트 실행 시간을 줄여라.

어떤 코드가 문제를 일으켰는지 알 수는 없다. -> 개발자도구 performance 탭을 확인해야 함

퍼포먼스 -> 화면이 로드되면서 

api 뒤에 길게 그려져 있는 꼬리는 콜백

minor gc -> 가비지 컬렉터의 작업 -> 메모리가 없을 때 필요없는 거 제거

현재 느린 건 Article 컴포넌트에 removeSpecialCharacter 라는 함수..

performance 탭에 들어가서 로드를 많이 잡아먹는 컴포넌트를 확인한다.

퍼포먼스 탭은 추후 반드시 공부해야겠다.

Article 컴포넌트의 removeCharacter 라는 함수가 원인

특정 문자열을 지우는데 2중 반복문을 돌고 있다 -> 특정 문자열을 효과적으로 제거할 수 있는 방법을 찾아서 불필요한 반복문을 없앤다.

썸네일용 텍스트여서 300자 정도만 있으면 되는데 최장 9만 자를 모두 검사하고 있다. -> substring 등의 메소드를 이용해서 필요한 만큼만 잘라서 검사한다.

performance 탭을 이용해서 bottleneck 코드를 확인하고, 해당 코드를 적절한 방법을 찾아 수정한다.

### 1-8) bundle 파일 분석. 

번들 파일을 분석하고 코드를 분할하자.

자바스크립트 파일이 크면 -> 자바스크립트가 모두 다운로드 된다음 화면이 렌더링되기 때문에 그만큼 화면이 늦게 나온다.

분석 툴 -> webpack bundle analyzer

```shell
$ npm i -D webpack-bundle-analyzer
```

설치 후 webpack.config 수정해야함

CRA를 이용한 프로젝트이기 때문에 webpack.config를 직접 수정할 수 없음.

cra-bundle-analyzer 를 이용한다.

```shell
$ npm i -D cra-bundle-analyzer
```

package.lock -> 우리가 사용하고 있는 모듈의 하위 디펜던시를 나타낸다.

refractor가 엄청난 크기를 차지하고 있다. 근데 view 페이지에서만 사용되기 때문에 List에서는 로드할 필요 없음.

필요할 때만 로드하면 된다.
```
번들 애널라이저를 통해 어떤 모듈이 크기를 많이 차지 하고 있는지 확인한 다음 해당 모듈이 어디서 어떻게 사용되는지 파악하고, 필요한 부분에서만 로드될 수 있게 처리한다.
``