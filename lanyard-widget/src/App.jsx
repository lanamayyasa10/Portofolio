import Lanyard from './components/Lanyard'
import './App.css'

function App() {
  const frontUrl = `${import.meta.env.BASE_URL}lana-front.svg?v8`
  const backUrl = `${import.meta.env.BASE_URL}lana-card.svg?v8`

  return (
    <main className="lanyard-embed">
      <Lanyard
        frontImage={frontUrl}
        backImage={backUrl}
        imageFit="cover"
        cardColor="#140d11"
        strapColor="#7b1f3f"
        metal="silver"
        finish="glossy"
        orientation="portrait"
        size={0.66}
        strapLength={0.5}
        strapWidth={0.62}
        gravity={0.9}
        damping={0.55}
        elasticity={0.5}
        breeze={0.18}
        interactive={true}
        intro={true}
        className="portfolio-lanyard"
        style={{ width: '100%', height: '100%' }}
      />
    </main>
  )
}

export default App