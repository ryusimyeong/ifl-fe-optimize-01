import React from 'react'

import './index.css'

function zeroPad(value, len) {
  const str = '0000000000' + value.toString()
  return str.substring(str.length - len)
}

/* 파라미터 참고: https://unsplash.com/documentation#supported-parameters */
function getParametersForUnsplash({ width, height, quality, format }) {
  return `?w=${width}&h=${height}&q=${quality}&fm=${format}&fit=crop`
}

/*
 * 파라미터로 넘어온 문자열에서 일부 특수문자를 제거하는 함수
 * (Markdown으로 된 문자열의 특수문자를 제거하기 위함)
 * */
function removeSpecialCharacter(str) {
  // 특정 문자열을 제거하는데 2중 반복문을 돌고 있음.
  // replace를 통해 특정 문자열을 제거하든지, 혹은 정규식을 사용하든지, 아니면 remove-markdown 등의 라이브러리를 사용한다.
  // 작업양을 줄여야 한다.(_str의 길이를 줄인다.) 지금 해당 부분이 필요한 부분은 본문의 일부분만 보여주면 된다. 즉, 텍스트 전체를 검사할 필요없고 필요한 만큼만 잘라서 검사한다.
  /**
  const removeCharacters = ['#', '_', '*', '~', '&', ';', '!', '[', ']', '`', '>', '\n', '=', '-']
  let _str = str
  let i = 0,
    j = 0
  for (i = 0; i < removeCharacters.length; i++) {
    j = 0
    while (j < _str.length) {
      if (_str[j] === removeCharacters[i]) {
        _str = _str.substring(0, j).concat(_str.substring(j + 1))
        continue
      }
      j++
    }
  }
  /*/
  // 앞의 300자만 잘라서 사용한다.
  let _str = str.substring(0, 300);
  // g는 앞 정규식을 만족하는 걸 모두 찾는다는 뜻
  _str = _str.replace(/[\#\_\*\~\&\;\!\[\]\`\>\n\=\-]/g, '')
  /**/

  return _str
}

function Article(props) {
  const createdTime = new Date(props.createdTime)
  return (
    <div className={'Article'}>
      <div className={'Article__summary'}>
        <div className={'Article__summary__title'}>{props.title}</div>
        <div className={'Article__summary__desc'}>{removeSpecialCharacter(props.content)}</div>
        <div className={'Article__summary__etc'}>
          {createdTime.getFullYear() +
            '.' +
            zeroPad(createdTime.getMonth() + 1, 2) +
            '.' +
            zeroPad(createdTime.getDate(), 2)}
        </div>
      </div>
      <div className={'Article__thumbnail'}>
        <img src={props.image + getParametersForUnsplash({ width: 240, height: 240, quality: 80, format: 'jpg' })} alt="thumbnail" />
      </div>
    </div>
  )
}

export default Article
