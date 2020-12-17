# 프론트엔드 최적화 강의 노트
## part 1

1. 성능 분석 툴
   1. 크롬 lighthouse
   2. 크롬 개발자 도구 performance 탭
   3. bundle analyzer
2. 이미지 사이즈 최적화
3. bottleneck 코드 최적화
4. code spliting, lazy load, preload
5. 텍스트 압축
6. 애니메이션 jank 현상 최적화
   1. Reflow, Repaint

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
```

### 1-9) code-spliting & lazy-load

코드스플리팅이란?

-> 코드를 분할하는 것. 덩치가 큰 번들 파일을 쪼개서 작은 파일들로 만드는 것.

List 페이지와 View 페이지 컴포넌트로 이루어져있다. 각각 페이지에는 필요한 모듈이 있다. 그런데 이 둘을 묶고 있는 번들 파일이 하나다 보니 List 를 볼 떄 필요없는 View의 모듈도 로드한다. 불필요하게 로드하니까 로딩이 느려진다.

즉, 번들 파일을 쪼개서 필요한 것만 받는 것.

코드스플리팅은 크게 페이지 별로 쪼갤 수도 있고, 모듈 별로 쪼갤 수도 있다. 어떤 방식으ㅗ 하든, 불필요, 중복되는 코드 없이 적절한 사이즈의 코드가 적절한 타이망에 로드되는 게 중요하다.

[코드분할](https://ko.reactjs.org/docs/code-splitting.html)

-> 여기선 Route-based code splitting 

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// 컴포넌트를 동적으로 import하고 그걸 lazy라는 함수로 감싸준다.
// 그러면 Route에 할당된 path에 접근할 때만 해당 컴포넌트가 로드된다.
// Suspense 는 동적으로 컴포넌트들이 로드되다보니 어떤 컴포넌트도 로드되지 않는 순간이 있을 수 있다. 그 때 에러를 내지 않고 Suspense내에 정의된 걸 나타낸다.
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```
코드 스플리팅을 나누는 주체가 [webpack](https://webpack.js.org/guides/code-splitting/) 가이드를 봐야하지만, CRA로 만든 앱은 그냥 만든다.

App.js (페이지 컴포넌트를 불러오는 부분)에 처리를 마치고 다시 번들 애널라이저를 돌려보면

청크 파일이 두 개가 되어있다. 

### 1-10 텍스트 압축 적용

프로덕션 환경과 개발환경은 조금의 차이가 있다. build 해서 프로덕션 환경에서의 기능을 보자.

즉, 프로덕션 환경에서도 검사, 조치가 필요하다.

그런데 프로덕션 환경에서는 Enable text compression 이라는 항목이 라이트하우스에 나온다.(아포츄너티)

웹페이지를 로드할 때는 그를 위한 리소스를 다운 받게 된다.

이 리소스들의 크기가 클수록 다운로드 속도가 느려진다.

이 리소스들의 크기를 줄이는 게 코드 스플리팅, 이미지 CDN, 텍스트 압축

개발자도구 -> network -> 컴포넌트의 header 탭 -> content-encoding 확인.

content-encoding 이 gZip으로 나오면 텍스트 압축을 한다.

## 텍스트 압축 알고리즘

GZIP -> 내부적으로 DEFLATE를 사용한다. DEFLATE보다 더 성능이 좋다.
DEFLATE -> LZ77이라는 알고리즘을 이용

이 압축은 서버에서 해주는 것이다. 리액트가 아닌 serve.js를 살펴보자.

```
"serve": "npm run build && node ./node_modules/serve/bin/serve.js -u -s build",
```

-u , -s 는 무슨 옵션이지?

```
node ./node_modules/serve/bin/serve.js --help
```

로 확인.

-u 는 no compression, -s single

이 -u를 없애주면 됨.

텍스트 압축은 서버에서 해주는 것. 서버가 여러 대일 경우 그 서버들이 통하는 라우터에 텍스트 압축 코드를 집어넣기도 한다.

그런데, 서버에서 압축을 해주면 클라이언트에서 압축을 풀어야 한다. 무분별하게 압축하면 느려진다.

파일의 크기가 2kb 이상이면 압축이 되고, 그 미만이면 되지 않는다. 

빌드할 때 텍스트 압축 옵션 등이 적용되어 있는지 살펴보자.

### 1강 요약 정리

라이트하우스로 검사

이미지 사이즈 최적화 -> 이미지를 불러올 때 적절한 사이즈로 불러온다.

보틀넥 코드 최적화 -> 퍼포먼스탭을 이용해서 지나치게 느린 함수를 찾아내 개선

코드 스플리팅 -> 번들 애널라이저를 이용한 뒤 번들 파일을 분석한 뒤 코드 스플리팅. 

텍스트 압축 -> 서비스를 배포할 때, build 단계에서 텍스트 압축(content-encoding)을 이용해서 처리한다. (옵션 수정)

# 2강 시작

애니메이션 최적화 reflow repaing - 렌더링 최적화

컴포넌트 레이지 로드 (페이지 컴포넌트를 페이지 단위로 코드 스플리팅하고 레이지 로드) 이번엔 페이지 구분이 아니라 한 페이지 내에서 일반 컴포넌트를 레이지로드 - 로딩 성능 최적화

컴포넌트 프리로딩 - 로딩 성능 최적화

이미지 프리로딩 - 로딩 성능 최적화

브라우저에서 애니메이션은 어떻게 작동할까

**쟁크 현상**

일반적으로 모니터의 주사율은 1초당 60개 화면을 보여줌, (60FPS 60프레임), 브라우져도 1초에 60개를 보여주려한다 

이때 브라우져가 60개를 못보여주고 1초에 20개, 30개 정도만 보여준다면 애니메이션은 버벅거리게 되고, 이 현상을 쟁크 현상이라고 한다.

그럼 왜 브라우져는 60게를 못 그릴까?

**브라우져 렌더링 과정**

HTML + CSS + JS 다운로드 -> DOM + CSSOM 변환 -> Render Tree 로 만들고 -> Layout -> Paint -> Composite

DOM 은HTML 요소를 tree 구조로 만든 것이고 CSSOM 은 스타일 요소들을  tree 구조로 만든 것이다.

이 두 가지를 조합해서 최종적으로 Render Tree를 만든다. 

Layout은 요소의 위치와 크기 등을 계산한다.

그 Layout 위에 색을 칠한다 (배경색상이나 그림자, 글자 색 등) (Paint)

Composite -> 각 레이어를 합성한다. 

이 일련의 과정을 Critical Rendering Path, 혹은 Pixel Pipeline이라고 한다.

화면이 변하면 이 과정을 처음부터 다시 수행하는데, 1초에 60번씩 보여주려니까 브라우져가 힘들어 하는 것

performance 탭에 timings 는 실행된 함수를 보여준다.

main tab을 보면 이 픽셀 파이프라인을 볼 수 있다. 점선은 화면이 나타나야 하는 시점이다. composite가 이 점선 전에 완료되어야 정상이다.

그럼 브라우져에게 부담을 적게 주는 방법은? 

layout과 paint 과정을 건너 뛴다.

**Reflow**

위치와 크기에 관여하는 요소

width나 height처럼 크기, 위치가 변경? 모두 재실행된다. 이걸 REFLOW


**Repaint**

outline 등 색상에 관여하는 요소

color나 background-color 같이 색상이 변경되면? layout 과정 생략

**GPU의 도움을 받아서 Reflow, Repaint 피하기**

transform, opacity 가 변경 -> layout, paint 생략

transform, opacity GPU가 관여할 수 있는 속성 -> 이건 GPU가 직접 데이터를 가공해서 composite로 넘긴다.

즉, 애니메이션을 쓸 때는 transform, opacity를 이용 > 색상 요소 > 위치와 크기에 관여하는 요소를 사용하면 된다.

### 2-4) 애니메이션 최적화

repaint 속성에는 가로를 바꿀 수 있는 게 없으니 transform을 사용한다.

https://developer.mozilla.org/ko/docs/Web/CSS/transform

transform의 scaleX를 사용하면 가로의 길이를 변화시킬 수 있다.

components / Bar 로 간다.

scale은 크기의 기준이 가운데다. 좌 혹은 오른쪽부터 그래프가 시작되길 원하면 다른 옵션이 필요하다.

transform-origin 으로 위치 기준을 잡아주고

width의 변화를 감지하고 있는 transition을 transform으로 바꿔준다.

performance 탭으로 가보면 FPS가 60으로 균일해지고 CPU의 작업량이 줄어든 것을 확인할 수 있다.

### 2-5) 코드 스플리팅과 페이지 내 컴포넌트 레이지 로드

cra-bundle-analyzer를 이용해서 분석

어떤 모듈이 언제 어떻게 필요한지 파악해서 그 시점에 맞게 나눠준다.

react-image-gallery는 모달이 떴을 때만 사용되면 되기 때문에 분할해준다.

어떤 모듈이 언제 필요한지 파악하는 게 제일 중요함.

### 2-6) 컴포넌트 pre-loading

레이지 로드를 하게 되면 모달을 눌렀을 때 한 번에 뜨지 않는다.

해당 모달을 클릭한 다음부터 이미지 등 콘텐츠를 다운받기 때문이다.

버튼을 클릭하기 전에 모달과 관련된 파일들은 미리 로드해놓으면 좋다. (preload)

근데 사용자가 언제 클릭할지 모르기 때문에 이 파일을 언제 로드해야 할지 애매하다.

컴포넌트 타이밍

1. 버튼 위에 마우스를 올려놨을 때
2. 최초 페이지가 로드 된 뒤, 모든 컴포넌트가 마운트 된 후에 한다.

component / App

preload는 lazyload의 단점. 즉 미리 리소스를 로드하지 않아 초기 진입 속도는 빠르지만 해당 모듈을 사용할 때는 느린 점을 보완하는 것이다.

### 2-7) 이미지 preload

그런데 해당 모듈 안에 있는 이미지 등 콘텐츠가 너무 크면 똑같이 느리다.

이 이미지를 미리 로드하자.

이미지는 어떻게 미리 로드하지? 화면을 노출하는 시점이 아니면 로드되지 않는다.

화면이 로드되지 않아도 할 수 있는방법?

JS의 new Image() 오브젝트를 사용한다.

```js
const img = new Image() // 인자는 너비와 높이
img.src = 'src'; // 이 순간 이미지가 로드된다.
```

그런데 문제는 위 방법은 그대로 캐싱이 되지 않는다. img.src에 값이 넣어질 때마다 네트워크를 보낸다. 즉, 동일한 이미지를 여러 번 src에 입력하면 리소스 낭비다.

이미지에 캐싱이 잘 되어 있는지 확인해야 한다. 캐싱이 되어 있지 않으면 preload하는 의미가 없다.

network tab에 가서 해당 이미지를 클릭해보면 headers 탭에 cache-control을 확인한다.

캐시가 된 자원들은 disk cache 혹은 memory cache 등으로 캐싱이 된다.

## 2) 정리

애니메이션 최적화 (reflow, repaint)

컴포넌트 최적화(code split)

컴포넌트 preload (lazy load 단점 극복: 나눠진 코드가 로드 시간이 느려짐)

이미지 preload (new Image()를 이용해서 contents preload)

## chrome dev tools performance 패널

웹페이지의 런타임 성능 분석

녹화를 누른 순간부터 정지를 누른 순간까지의 성능을 측정

새로고침 버튼은 페이지 로드가 시작 ~ 끝날 때까지 성능 측정

profile load/save 성능 측정 결과저장 및 불러오기 가능

screenshot -> 화면의 변화를 스크린샷으로 찍어서 보여줌

memory -> 화면 구동 시 메모리가 어떻게 사용되고 있는지 보여줌

GC -> 가비지 콜렉터를 실행시킴

옵션
1. disable javascript sample -> 시스템이 실행시키는 자질구레한 자바스크립트 실행을 보여주지 않음
2. enable advanced paint instrumentation -> 화면 페인트 (paint, composite 등)의 과정을 더 자세히 보여줌
3. network : 네트워크 속도 느리게
4. CPU: CPU 성능 느리게


맨위 영역 

**타임라인** -> 노란색, 자바스크립트.. 보라색, 레이아웃... 초록색, 페인트or컴포짓

네트워크 영역

네트워크의 요청 순서 언제 받았고 처리되었는지

**네트워크** 탭 내에서 실선 -> 회색 -> 진회색 -> 실선으로 이루어진 요소를 확인할 수 있는데 각각 네트워크 연결 준비, 네트워크 요청, 요청 후 내용 다운로드, 내용 처리 시간을 뜻한다.

프레임부터 CPU가 처리한 걸 보여준다.

**프레임**은 스크린샷

**타이밍** 크롬에서 측정하는 시간 기준으로 활동 보여준다.

DCL -> DOM contents loading

FP -> FirstPaint

**메인**

자바스크립트 활동을 보여주기 때문에 가장 중요

**래스터** 쓰레드부터는 그냥 그럼

아래 써머리는 main을 요약

바텀업은 실행된 것의 역순으로 보여줌 calltree은 시간순

enable advanced paint instrumentation c체크 후 성능 분석 -> frame 내의 그래프 하나 클릭하면 layer라는 탭이 하단에 생긴다

메인영역에서 paint 부분을 클릭하면 layout 이후에 paint 작업이 어떻게 이루어졌는지 확인할 수 있다.