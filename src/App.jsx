import { useState, useRef, useEffect } from 'react';
import Clock from './components/Clock';
import Dock from './components/Dock';
import DraggableWindow from './components/DraggableWindow';
import ContextMenu from './components/Context';
import CommandPalette from './components/CommandPalette';
import QuickLinks from './components/QuickLinks';
import DesktopSearch from './components/DesktopSearch';
import Mascot from './components/Mascot';
import WorldClock from './components/WorldClock';
import Weather from './components/Weather';
import Todo from './components/Todo';
import Playlist from './components/Playlist';
import Projects from './components/Projects';
import Calculator from './components/Calculator';
import Pomodoro from './components/Pomodoro';
import Converter from './components/Converter';
import StickyNotes from './components/StickyNotes';
import SerialMonitor from './components/SerialMonitor';
import QrCode from './components/QrCode';
import './App.css';

// gradient wallpaper, change it by right click
const WALLPAPERS = [
  { name: 'Midnight', css: 'radial-gradient(ellipse at top, #1a1a2e, #0d0d17 70%)' },
  { name: 'Void', css: 'linear-gradient(160deg, #000000, #0f0f12)' },
  { name: 'Ocean', css: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' },
  { name: 'Aurora', css: 'linear-gradient(-45deg, #1a0b2e, #16213e, #0f3460, #1a0b2e)' },
  { name: 'Sunset', css: 'linear-gradient(135deg, #2d1b2e, #4a2545, #6b2d5c)' },
];

// list of app, right click
const WINDOW_CONFIG = {
  worldclock: { title: 'World Clock', width: 420, icon: '🕐', Component: WorldClock },
  weather: { title: 'Weather', width: 340, icon: '🌤️', Component: Weather },
  todo: { title: 'To-Do List', width: 480, icon: '📝', Component: Todo },
  playlist: { title: 'Playlist', width: 360, icon: '🎵', Component: Playlist },
  projects: { title: 'Projects', width: 640, icon: '💼', Component: Projects },
  calculator: { title: 'Calculator', width: 300, icon: '🧮', Component: Calculator },
  pomodoro: { title: 'Pomodoro Timer', width: 320, icon: '🍅', Component: Pomodoro },
  converter: { title: 'Unit Converter', width: 340, icon: '📐', Component: Converter },
  stickynotes: { title: 'Sticky Notes', width: 460, icon: '🗒️', Component: StickyNotes },
  serial: { title: 'Serial Monitor', width: 380, icon: '📟', Component: SerialMonitor },
  qrcode: { title: 'QR Code Generator', width: 320, icon: '🔲', Component: QrCode },
};

const LAYOUT_KEY = 'desktop-layout';

function loadLayout() {
  try {
    const saved = localStorage.getItem(LAYOUT_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    // if the saved layout is corrupted, just restart
  }
  return { openWindows: [], wallpaperIndex: 0 };
}

function App() {
  const initial = loadLayout();

  const [openWindows, setOpenWindows] = useState(initial.openWindows || []);
  const [wallpaperIndex, setWallpaperIndex] = useState(initial.wallpaperIndex || 0);
  const [contextMenu, setContextMenu] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // keep track of stacking order,
  const zCounter = useRef(
    initial.openWindows && initial.openWindows.length > 0
      ? Math.max(...initial.openWindows.map((w) => w.zIndex || 10)) + 1
      : 10
  );

  // when user refresh, all data still keep in local
  useEffect(() => {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify({ openWindows, wallpaperIndex }));
  }, [openWindows, wallpaperIndex]);

  const openOrFocus = (type) => {
    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.type === type);
      zCounter.current += 1;

      
      if (existing) {
        return prev.map((w) =>
          w.type === type ? { ...w, zIndex: zCounter.current, minimized: false } : w
        );
      }

      return [
        ...prev,
        { id: `${type}-${Date.now()}`, type, zIndex: zCounter.current, minimized: false, position: null, size: null },
      ];
    });
  };

  const closeWindow = (id) => setOpenWindows((prev) => prev.filter((w) => w.id !== id));

  const focusWindow = (id) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: z } : w)));
  };

  const minimizeWindow = (id) =>
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));

  const restoreWindow = (id) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: false, zIndex: z } : w)));
  };

  const updateWindowPosition = (id, position) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, position } : w)));
  };

  const updateWindowSize = (id, size) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
  };

  const cycleWallpaper = () => setWallpaperIndex((i) => (i + 1) % WALLPAPERS.length);

  const handleDesktopContextMenu = (e) => {
    e.preventDefault(); // stop the browser's own right-click menu from also showing
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Ctrl+K toggles the command palette from anywhere
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // right-click menu 
  const dockItems = Object.keys(WINDOW_CONFIG).map((type) => ({
    id: type,
    icon: WINDOW_CONFIG[type].icon,
    label: WINDOW_CONFIG[type].title,
    onClick: () => openOrFocus(type),
  }));

  const activeTypes = openWindows.map((w) => w.type);

  const contextMenuItems = [
    { icon: '🖼️', label: `Wallpaper: ${WALLPAPERS[wallpaperIndex].name} (click to change)`, onClick: cycleWallpaper },
    { divider: true },
    ...Object.keys(WINDOW_CONFIG).map((type) => ({
      icon: WINDOW_CONFIG[type].icon,
      label: `Open ${WINDOW_CONFIG[type].title}`,
      onClick: () => openOrFocus(type),
    })),
    { divider: true },
    { icon: '⌘', label: 'Command Palette', onClick: () => setPaletteOpen(true) },
  ];

  const paletteCommands = [
    ...Object.keys(WINDOW_CONFIG).map((type) => ({
      icon: WINDOW_CONFIG[type].icon,
      label: `Open ${WINDOW_CONFIG[type].title}`,
      onRun: () => openOrFocus(type),
    })),
    { icon: '🖼️', label: 'Change Wallpaper', onRun: cycleWallpaper },
  ];

  const minimizedWindows = openWindows.filter((w) => w.minimized);

  return (
    <div
      className="desktop"
      style={{ background: WALLPAPERS[wallpaperIndex].css }}
      onContextMenu={handleDesktopContextMenu}
    >
      <Clock />
      <Mascot />
      <Dock items={dockItems} activeTypes={activeTypes} />
      <QuickLinks />
      <DesktopSearch apps={dockItems} onOpenApp={openOrFocus} />

      {openWindows.map((win, i) => {
        const config = WINDOW_CONFIG[win.type];
        const Component = config.Component;

        return (
          <DraggableWindow
            key={win.id}
            title={config.title}
            width={config.width}
            zIndex={win.zIndex}
            cascadeIndex={i}
            minimized={win.minimized}
            initialPosition={win.position}
            initialSize={win.size}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onPositionChange={(pos) => updateWindowPosition(win.id, pos)}
            onSizeChange={(size) => updateWindowSize(win.id, size)}
          >
            <Component />
          </DraggableWindow>
        );
      })}

      {minimizedWindows.length > 0 && (
        <div className="taskbar">
          {minimizedWindows.map((w) => (
            <button key={w.id} className="taskbar-chip" onClick={() => restoreWindow(w.id)}>
              {WINDOW_CONFIG[w.type].icon} {WINDOW_CONFIG[w.type].title}
            </button>
          ))}
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={paletteCommands}
      />
    </div>
  );
}

export default App;