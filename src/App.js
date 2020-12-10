import React, { Suspense, lazy } from 'react'
import { Switch, Route } from 'react-router-dom'
import './App.css'
// import ListPage from './pages/ListPage/index'
// import ViewPage from './pages/ViewPage/index'

// 코드 스플리팅을 위한 레이지로드
const ListPage = lazy(() => import('./pages/ListPage/index'));
const ViewPage = lazy(() => import('./pages/ViewPage/index'));

function App() {
  return (
    <div className="App">
      {/* fallback = 로드가 다 되지 않았을 때 어떤 게 나올지 결정 */}
      <Suspense fallback={<div>loading...</div>}>
        <Switch>
          <Route path="/" component={ListPage} exact />
          <Route path="/view/:id" component={ViewPage} exact />
        </Switch>
      </Suspense>
    </div>
  )
}

export default App
