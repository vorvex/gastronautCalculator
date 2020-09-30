let xsmallPackage = {
  title: 'XS',
  price: 32,
  includedRes: 700,
  additionalRes: 0.13
};

let smallPackage = {
  title: 'S',
  price: 112,
  includedRes: 1700,
  additionalRes: 0.12
};

let mediumPackage = {
  title: 'M',
  price: 192,
  includedRes: 2700,
  additionalRes: 0.11
};

let largePackage = {
  title: 'L',
  price: 312,
  includedRes: 4200,
  additionalRes: 0.11
};

let xlargePackage = {
  title: 'XL',
  price: 450,
  includedRes: 10000,
  additionalRes: 0
}

let packages = [xsmallPackage, smallPackage, mediumPackage, largePackage, xlargePackage];

const Slider = ({ value, onChange = e => console.log(e), min = 1, max = 100, step = 5, stringifyValue = val => val }) => {  
  return (
    <div className="sliderInner">
      <input className="slider" type="range" { ...{ min, max, value, onChange, step } } />
      <span style={{ marginLeft: 5 }}>{stringifyValue(value)}</span>
    </div>
  )
}

const SliderContainer = ({ title = '', ...sliderProps }) => { 
  return (
    <div className="sliderContainer">
      <h4>{title}</h4>
      <Slider {...sliderProps} />
    </div>
  )
}

const PriceTitle = ({ price = 0, label = '' }) => {
  return (
    <div className="priceTitle">
      <h5>{label}</h5>
      <h4>{Math.round(price)},00 € / Monat</h4>
    </div>
  )
};

const App = () => {
  
  const [reservations, setReservations] = React.useState(20);
  
  const reservationSlider = {
    onChange: e => setReservations(e.target.value),
    value: reservations,
    min: 10,
    max: 500,
    step: 10
  }
  
  const [shifts, setShifts] = React.useState(6);
  
  const shiftSlider = {
    onChange: e => setShifts(e.target.value),
    value: shifts,
    min: 1,
    max: 7,
    step: 1
  }
  
  const currentPackage = React.useMemo(() => {
    let totalReservations = Math.round(reservations * shifts * (52/12));
    
    let packs = packages.map(p => {
      
      let extra = (totalReservations * 1.05 - p.includedRes) * p.additionalRes;
     
      let price = Math.round(Math.max(0, extra)) + p.price
      
      return { price, title: p.title, totalReservations }
    });
    
    return packs.sort((a,b) => a.price - b.price)[0];
    
  }, [reservations, shifts])
  
  const [otPercentage, setotPercentage] = React.useState(0.1);
  
  const [otPackage, setotPackage] = React.useState(99);
  
  const openTablePrice = React.useMemo(() => {
    let totalReservations = Math.round(reservations * shifts * (52/12));
    
    return totalReservations * otPercentage + otPackage
    
  }, [reservations, shifts, otPercentage, otPackage]);
  
  const opentableSlider = {
    onChange: e => setotPercentage(e.target.value),
    value: otPercentage,
    min: 0.05,
    max: 1,
    step: 0.05,
    stringifyValue: val => `${Math.round(val * 100)}%`
  }
  
  return (
   <div>
      <div className="header ">
        <h1>Paket Rechner</h1>
        <img src="../assets/logo2.gif" alt="loading..." width="auto" height="80px" />

      </div>
     <div className="main">
       <div className="mainLeft">
         <SliderContainer {...shiftSlider} title="Öffnungstage pro Woche" />
         <SliderContainer {...reservationSlider} title="Platzierungen pro Tag" />
         <div>
         <h3>Open Table Vergleich</h3>
         <div style={{ marginBottom: 20 }}>
           <h4 style={{ marginBottom: 5 }} >Basis Paket</h4>
           <button className={otPackage === 29 ? 'active' : ''} onClick={() => setotPackage(29)}>Basic (29,00 €)</button>
           <button className={otPackage === 99 ? 'active' : ''} onClick={() => setotPackage(99)}>Core (99,00 €)</button>
           <button className={otPackage === 199 ? 'active' : ''} onClick={() => setotPackage(199)}>Pro (199,00 €)</button>
         </div>
           <span style={{ marginBottom: 10, color: '#d3d3d3' }}>PLUS</span>
         <SliderContainer {...opentableSlider} title="Geworbene Kunden in % (1,50 € / Gast)"  />
         
         <div className="prices">
           <PriceTitle price={openTablePrice} label="Open Table" />
           <span>vs</span>
           <PriceTitle price={currentPackage.price} label="Gastronaut" />
         </div>
       </div>
       </div>
       <div className="mainRight">
         <div>
          <p><strong>Reservierungen:</strong> {currentPackage.totalReservations}</p>
          <p><strong>Paket:</strong> {currentPackage.title}</p>
          <p><strong>Preis:</strong> {currentPackage.price},00 € / Monat</p>
         </div>
         
       </div>
     </div>
       
   </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'));