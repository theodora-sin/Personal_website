import { useState } from 'react';

const CATEGORIES = {
  length: {
    label: 'Length',
    units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  },
  weight: {
    label: 'Weight',
    units: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 },
  },
  temperature: {
    label: 'Temperature',
    units: { C: 'C', F: 'F', K: 'K' },
  },
};

function convertTemp(value, from, to) {
  let celsius;
  if (from === 'C') celsius = value;
  else if (from === 'F') celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  if (to === 'C') return celsius;
  if (to === 'F') return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

function UnitConverterPanel() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [inputValue, setInputValue] = useState('1');

  const units = Object.keys(CATEGORIES[category].units);

  const switchCategory = (cat) => {
    const firstUnits = Object.keys(CATEGORIES[cat].units);
    setCategory(cat);
    setFromUnit(firstUnits[0]);
    setToUnit(firstUnits[1] || firstUnits[0]);
  };

  const getResult = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '';

    if (category === 'temperature') {
      return convertTemp(val, fromUnit, toUnit).toFixed(2);
    }

    const factorFrom = CATEGORIES[category].units[fromUnit];
    const factorTo = CATEGORIES[category].units[toUnit];
    const result = (val * factorFrom) / factorTo;
    return Number(result.toFixed(6)).toString();
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="converter">
      <div className="conv-tabs">
        {Object.keys(CATEGORIES).map((cat) => (
          <button
            key={cat}
            className={category === cat ? 'active' : ''}
            onClick={() => switchCategory(cat)}
          >
            {CATEGORIES[cat].label}
          </button>
        ))}
      </div>

      <div className="conv-row">
        <input
          type="number"
          className="conv-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <select className="conv-select" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
          {units.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      <button className="conv-swap" onClick={swapUnits}>⇅</button>

      <div className="conv-row">
        <div className="conv-result">{getResult()}</div>
        <select className="conv-select" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
          {units.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
    </div>
  );
}

export default UnitConverterPanel;