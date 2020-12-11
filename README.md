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