
import Lanyard from './components/Lanyard'
import './App.css'

function App() {
  const frontUrl = `${import.meta.env.BASE_URL}lan.png`
  const backUrl = `${import.meta.env.BASE_URL}lana-card.svg`

  return (
    <main className="lanyard-embed">
      <Lanyard
        frontImage={frontUrl}
        backImage={backUrl}
        imageFit="cover"
        cardColor="#1b1117"
        strapColor="#7b1738"
        metal="silver"
        finish="glossy"
        orientation="portrait"
        size={0.68}
        interactive={true}
        intro={true}
        className="portfolio-lanyard"
        style={{ width: '100%', height: '100%' }}
      />
    </main>
  )
}

export default App
