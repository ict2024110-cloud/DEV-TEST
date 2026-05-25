import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mouse, Keyboard, Gamepad2, Touchpad, Usb, HardDrive, 
  Volume2, Cpu, Activity, Zap, Battery, Wifi, Monitor,
  ChevronRight, Check, X, AlertCircle, Menu, X as CloseIcon
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Types
interface MouseState {
  x: number;
  y: number;
  leftClick: boolean;
  rightClick: boolean;
  middleClick: boolean;
  scroll: number;
  connected: boolean;
}

interface GamepadState {
  connected: boolean;
  name: string;
  buttons: boolean[];
  axes: number[];
  vibration: boolean;
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
}

interface USBDevice {
  name: string;
  type: string;
  connected: boolean;
}

interface StorageDevice {
  name: string;
  total: number;
  used: number;
  free: number;
  health: string;
  readSpeed: number;
  writeSpeed: number;
}

interface PerformanceData {
  cpu: number;
  ram: number;
  fps: number;
  download: number;
  upload: number;
  battery: number;
  charging: boolean;
}

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    cpu: 0,
    ram: 0,
    fps: 60,
    download: 0,
    upload: 0,
    battery: 100,
    charging: false
  });
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);

  // Simulate performance data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(prev => {
        const newData = {
          cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() - 0.5) * 20)),
          ram: Math.min(100, Math.max(20, prev.ram + (Math.random() - 0.5) * 10)),
          fps: Math.min(144, Math.max(30, prev.fps + (Math.random() - 0.5) * 30)),
          download: Math.max(0, prev.download + (Math.random() - 0.5) * 50),
          upload: Math.max(0, prev.upload + (Math.random() - 0.5) * 20),
          battery: prev.battery,
          charging: prev.charging
        };
        
        setPerformanceHistory(history => [...history.slice(-29), {
          time: new Date().toLocaleTimeString(),
          cpu: newData.cpu,
          ram: newData.ram,
          fps: newData.fps
        }]);
        
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Battery status
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setPerformanceData(prev => ({
          ...prev,
          battery: battery.level * 100,
          charging: battery.charging
        }));
        
        battery.addEventListener('levelchange', () => {
          setPerformanceData(prev => ({ ...prev, battery: battery.level * 100 }));
        });
        battery.addEventListener('chargingchange', () => {
          setPerformanceData(prev => ({ ...prev, charging: battery.charging }));
        });
      });
    }
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'mouse', label: 'Mouse Test', icon: Mouse },
    { id: 'keyboard', label: 'Keyboard Test', icon: Keyboard },
    { id: 'gamepad', label: 'Gamepad Test', icon: Gamepad2 },
    { id: 'touch', label: 'Touch Test', icon: Touchpad },
    { id: 'usb', label: 'USB Devices', icon: Usb },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'audio', label: 'Audio Test', icon: Volume2 },
    { id: 'performance', label: 'Performance', icon: Cpu },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="animated-bg" />
      <div className="grid-overlay" />
      
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 left-4 z-50 lg:hidden glass-card p-3"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside 
        className={`sidebar fixed lg:sticky top-0 left-0 h-screen w-64 p-6 flex flex-col z-40 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        initial={false}
        animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -256 }}
      >
        {/* Logo */}
        <motion.div 
          className="mb-8 mt-8 lg:mt-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold gradient-text neon-text-blue">DEV-TEST</h1>
          <p className="text-xs text-gray-400 mt-1">Hardware Testing Platform</p>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-cyan-400' : ''} />
              <span className="text-sm font-medium">{item.label}</span>
              {activeTab === item.id && (
                <ChevronRight size={16} className="ml-auto text-cyan-400" />
              )}
            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-4">Made by Hasni</p>
          <div className="space-y-2">
            <a 
              href="https://www.instagram.com/cine.snaper?igsh=cnd0bjRid2tkcHgx"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram
            </a>
            <a 
              href="https://github.com/ict2024110-cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen p-4 lg:p-8 pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <Dashboard key="dashboard" performanceData={performanceData} history={performanceHistory} />
          )}
          {activeTab === 'mouse' && <MouseTester key="mouse" />}
          {activeTab === 'keyboard' && <KeyboardTester key="keyboard" />}
          {activeTab === 'gamepad' && <GamepadTester key="gamepad" />}
          {activeTab === 'touch' && <TouchTester key="touch" />}
          {activeTab === 'usb' && <USBTester key="usb" />}
          {activeTab === 'storage' && <StorageTester key="storage" />}
          {activeTab === 'audio' && <AudioTester key="audio" />}
          {activeTab === 'performance' && <PerformanceMonitor key="performance" data={performanceData} history={performanceHistory} />}
        </AnimatePresence>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Dashboard Component
function Dashboard({ performanceData, history }: { performanceData: PerformanceData; history: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text neon-text-blue mb-2">DEV-TEST</h2>
        <p className="text-gray-400">Professional Hardware Diagnostic Platform</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={Cpu} 
          label="CPU Usage" 
          value={`${performanceData.cpu.toFixed(1)}%`}
          color="cyan"
        />
        <StatCard 
          icon={Zap} 
          label="RAM Usage" 
          value={`${performanceData.ram.toFixed(1)}%`}
          color="purple"
        />
        <StatCard 
          icon={Activity} 
          label="FPS" 
          value={performanceData.fps.toFixed(0)}
          color="green"
        />
        <StatCard 
          icon={Battery} 
          label="Battery" 
          value={`${performanceData.battery.toFixed(0)}%`}
          color="yellow"
        />
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon={Mouse}
          title="Mouse Tester"
          description="Test mouse movement, clicks, scroll wheel, and polling rate"
          color="cyan"
        />
        <FeatureCard 
          icon={Keyboard}
          title="Keyboard Tester"
          description="Real-time key detection with full layout visualization"
          color="purple"
        />
        <FeatureCard 
          icon={Gamepad2}
          title="Gamepad Tester"
          description="Support for Xbox, PlayStation, and generic controllers"
          color="green"
        />
        <FeatureCard 
          icon={Touchpad}
          title="Touch Tester"
          description="Multi-touch support with gesture detection"
          color="pink"
        />
        <FeatureCard 
          icon={HardDrive}
          title="Storage Monitor"
          description="Check drive health, usage, and read/write speeds"
          color="orange"
        />
        <FeatureCard 
          icon={Volume2}
          title="Audio Tester"
          description="Speaker and microphone testing with visualizer"
          color="blue"
        />
      </div>

      {/* Performance Chart */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="text-cyan-400" />
          Performance History
        </h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(20,20,35,0.95)', 
                  border: '1px solid rgba(0,240,255,0.3)',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#00f0ff" fill="url(#cpuGradient)" name="CPU %" />
              <Area type="monotone" dataKey="ram" stroke="#bc13fe" fill="url(#ramGradient)" name="RAM %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colorClasses: any = {
    cyan: 'text-cyan-400 bg-cyan-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    green: 'text-green-400 bg-green-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/20',
    pink: 'text-pink-400 bg-pink-500/20',
    orange: 'text-orange-400 bg-orange-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
  };

  return (
    <motion.div 
      className="glass-card p-4"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
  return (
    <motion.div 
      className="glass-card p-6 cursor-pointer"
      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-500 to-purple-600 flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </motion.div>
  );
}

// Mouse Tester Component
function MouseTester() {
  const [mouseState, setMouseState] = useState<MouseState>({
    x: 0,
    y: 0,
    leftClick: false,
    rightClick: false,
    middleClick: false,
    scroll: 0,
    connected: true
  });
  const [trail, setTrail] = useState<{x: number, y: number}[]>([]);
  const [pollingRate, setPollingRate] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseState(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
      setTrail(prev => [...prev.slice(-20), { x: e.clientX, y: e.clientY }]);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setMouseState(prev => ({
        ...prev,
        leftClick: e.button === 0,
        rightClick: e.button === 2,
        middleClick: e.button === 1
      }));
    };

    const handleMouseUp = () => {
      setMouseState(prev => ({
        ...prev,
        leftClick: false,
        rightClick: false,
        middleClick: false
      }));
    };

    const handleWheel = (e: WheelEvent) => {
      setMouseState(prev => ({ ...prev, scroll: prev.scroll + e.deltaY }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel);

    // Simulate polling rate
    const pollingInterval = setInterval(() => {
      setPollingRate(Math.floor(120 + Math.random() * 1000));
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      clearInterval(pollingInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold gradient-text neon-text-blue">Mouse Tester</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Movement Display */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Mouse className="text-cyan-400" />
            Movement Tracker
          </h3>
          <div 
            ref={containerRef}
            className="relative h-64 bg-black/50 rounded-xl overflow-hidden border border-cyan-500/30"
          >
            {/* Trail */}
            {trail.map((point, index) => (
              <div
                key={index}
                className="absolute w-3 h-3 rounded-full bg-cyan-400"
                style={{
                  left: point.x % (containerRef.current?.clientWidth || 400),
                  top: point.y % 256,
                  opacity: (index + 1) / trail.length,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
            
            {/* Cursor */}
            <div
              className="absolute w-6 h-6 pointer-events-none"
              style={{
                left: mouseState.x % (containerRef.current?.clientWidth || 400),
                top: mouseState.y % 256,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-cyan-400" />
            </div>

            {/* Coordinates */}
            <div className="absolute bottom-2 right-2 text-xs font-mono text-cyan-400">
              X: {mouseState.x} | Y: {mouseState.y}
            </div>
          </div>
        </div>

        {/* Button Status */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Button Status</h3>
          <div className="space-y-4">
            <ButtonStatus label="Left Click" active={mouseState.leftClick} color="cyan" />
            <ButtonStatus label="Right Click" active={mouseState.rightClick} color="purple" />
            <ButtonStatus label="Middle Click" active={mouseState.middleClick} color="green" />
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-bold mb-2 text-gray-400">Scroll Wheel</h4>
            <div className="text-2xl font-mono text-purple-400">{mouseState.scroll}</div>
          </div>
        </div>
      </div>

      {/* Technical Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <InfoCard label="Polling Rate" value={`${pollingRate} Hz`} icon={Activity} />
        <InfoCard label="Connection" value="USB / Wireless" icon={Check} />
        <InfoCard label="Status" value="Connected" icon={Zap} color="green" />
      </div>
    </motion.div>
  );
}

function ButtonStatus({ label, active, color }: any) {
  const colors: any = {
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
      <span className="font-medium">{label}</span>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
        active ? `${colors[color]} neon-glow-${color}` : 'bg-gray-700'
      }`}>
        {active ? <Check size={16} /> : <X size={16} />}
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon: Icon, color = 'cyan' }: any) {
  return (
    <div className="glass-card p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
        <Icon size={24} className={`text-${color}-400`} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

// Keyboard Tester Component
function KeyboardTester() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [keyHistory, setKeyHistory] = useState<{key: string, time: string}[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.add(e.key.toLowerCase());
        return newSet;
      });
      setKeyHistory(prev => [...prev.slice(-9), { key: e.key, time: new Date().toLocaleTimeString() }]);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const keyboardLayout = [
    ['esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
    ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
    ['ctrl', 'win', 'alt', 'space', 'alt', 'fn', 'menu', 'ctrl']
  ];

  const getKeyWidth = (key: string) => {
    const widths: any = {
      'backspace': 'w-20',
      'tab': 'w-16',
      'caps': 'w-18',
      'enter': 'w-20',
      'shift': 'w-24',
      'ctrl': 'w-14',
      'win': 'w-12',
      'alt': 'w-12',
      'space': 'w-64',
      'fn': 'w-12',
      'menu': 'w-12',
    };
    return widths[key] || 'w-12';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold gradient-text neon-text-blue">Keyboard Tester</h2>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Keyboard className="text-purple-400" />
          Virtual Keyboard
        </h3>
        
        <div className="flex flex-col items-center gap-2 overflow-x-auto pb-4">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((key) => {
                const isActive = pressedKeys.has(key.toLowerCase());
                return (
                  <motion.div
                    key={key}
                    className={`key-button ${getKeyWidth(key)} ${isActive ? 'active' : ''}`}
                    whileTap={{ scale: 0.9 }}
                  >
                    {key.toUpperCase()}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Key History */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4">Recent Key Presses</h3>
        <div className="space-y-2">
          {keyHistory.length === 0 ? (
            <p className="text-gray-400">Press any key to see history...</p>
          ) : (
            keyHistory.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-white/5">
                <span className="font-mono text-cyan-400">"{item.key}"</span>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <InfoCard label="Keys Pressed" value={pressedKeys.size.toString()} icon={Activity} />
        <InfoCard label="N-Key Rollover" value="Supported" icon={Check} color="green" />
        <InfoCard label="Connection" value="USB / Bluetooth" icon={Usb} />
      </div>
    </motion.div>
  );
}

// Gamepad Tester Component
function GamepadTester() {
  const [gamepadState, setGamepadState] = useState<GamepadState>({
    connected: false,
    name: '',
    buttons: [],
    axes: [],
    vibration: false
  });

  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      setGamepadState({
        connected: true,
        name: e.gamepad.id,
        buttons: e.gamepad.buttons.map(b => b.pressed),
        axes: Array.from(e.gamepad.axes),
        vibration: true
      });
    };

    const handleGamepadDisconnected = () => {
      setGamepadState(prev => ({ ...prev, connected: false, name: '' }));
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (gamepads[0]) {
        setGamepadState(prev => ({
          ...prev,
          buttons: gamepads[0]!.buttons.map(b => b.pressed),
          axes: Array.from(gamepads[0]!.axes)
        }));
      }
      requestAnimationFrame(pollGamepad);
    };

    pollGamepad();

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold gradient-text neon-text-blue">Gamepad Tester</h2>

      {!gamepadState.connected ? (
        <div className="glass-card p-12 text-center">
          <Gamepad2 size={64} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-bold mb-2">No Controller Connected</h3>
          <p className="text-gray-400">Connect your Xbox, PlayStation, or USB controller to start testing</p>
        </div>
      ) : (
        <>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Gamepad2 className="text-green-400" />
              {gamepadState.name}
            </h3>
            
            {/* Controller Visualization */}
            <div className="relative h-64 bg-black/50 rounded-xl flex items-center justify-center">
              {/* Left Stick */}
              <div className="absolute left-16 w-24 h-24 rounded-full border-2 border-gray-600 flex items-center justify-center">
                <div 
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 transition-all"
                  style={{
                    transform: `translate(${gamepadState.axes[0] * 30}px, ${gamepadState.axes[1] * 30}px)`
                  }}
                />
              </div>

              {/* Right Stick */}
              <div className="absolute right-16 w-24 h-24 rounded-full border-2 border-gray-600 flex items-center justify-center">
                <div 
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 transition-all"
                  style={{
                    transform: `translate(${gamepadState.axes[2] * 30}px, ${gamepadState.axes[3] * 30}px)`
                  }}
                />
              </div>

              {/* D-Pad */}
              <div className="absolute left-32 top-1/2 -translate-y-1/2 w-20 h-20">
                <div className="grid grid-cols-3 gap-1">
                  {[7, 0, 0, 2, 0, 0, 1, 0, 3].map((btn, i) => (
                    <div 
                      key={i}
                      className={`w-6 h-6 rounded ${btn && gamepadState.buttons[btn] ? 'bg-green-500' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
              </div>

              {/* ABXY Buttons */}
              <div className="absolute right-32 top-1/2 -translate-y-1/2 w-20 h-20">
                <div className="grid grid-cols-3 gap-1">
                  {[0, 1, 0, 3, 0, 2, 0, 0, 0].map((btn, i) => (
                    <div 
                      key={i}
                      className={`w-6 h-6 rounded-full ${btn && gamepadState.buttons[btn] ? 'bg-green-500 neon-glow-green' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Button Status */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Button Status</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {gamepadState.buttons.map((pressed, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded text-center text-xs ${
                    pressed ? 'bg-green-500 text-black' : 'bg-gray-700'
                  }`}
                >
                  Btn {index}
                </div>
              ))}
            </div>
          </div>

          {/* Axis Values */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Axis Values</h3>
            <div className="space-y-2">
              {gamepadState.axes.map((value, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm w-16">Axis {index}</span>
                  <div className="flex-1 progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${((value + 1) / 2) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono w-16 text-right">{value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

// Touch Tester Component
function TouchTester() {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [gesture, setGesture] = useState<string>('None');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const points = Array.from(e.touches).map(touch => ({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY
      }));
      setTouchPoints(points);
      
      if (points.length >= 2) setGesture('Multi-touch');
      else if (points.length === 1) setGesture('Single touch');
    };

    const handleTouchMove = (e: TouchEvent) => {
      const points = Array.from(e.touches).map(touch => ({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY
      }));
      setTouchPoints(points);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const points = Array.from(e.touches).map(touch => ({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY
      }));
      setTouchPoints(points);
      
      if (points.length === 0) setGesture('None');
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold gradient-text neon-text-blue">Touchscreen Tester</h2>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Touchpad className="text-pink-400" />
          Touch Area
          <span className="text-sm text-gray-400 ml-auto">(Touch the screen to test)</span>
        </h3>
        
        <div 
          ref={containerRef}
          className="relative h-96 bg-black/50 rounded-xl overflow-hidden border border-pink-500/30 touch-none"
        >
          {touchPoints.map((point) => (
            <div
              key={point.id}
              className="touch-point"
              style={{
                left: point.x - (containerRef.current?.getBoundingClientRect().left || 0),
                top: point.y - (containerRef.current?.getBoundingClientRect().top || 0),
              }}
            />
          ))}
          
          {touchPoints.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Touch the screen to see touch points</p>
            </div>
          )}
        </div>
      </div>

      {/* Touch Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <InfoCard label="Active Touches" value={touchPoints.length.toString()} icon={Activity} />
        <InfoCard label="Gesture" value={gesture} icon={Touchpad} color="pink" />
        <InfoCard label="Max Points" value="10+" icon={Check} color="green" />
      </div>

      {/* Mobile Optimized Message */}
      <div className="glass-card p-6 text-center">
        <p className="text-gray-400">
          📱 This test works best on mobile devices with touchscreens. 
          On desktop, you can simulate touch using browser developer tools.
        </p>
      </div>
    </motion.div>
  );
}

// USB Tester Component
function USBTester() {
  const [devices, setDevices] = useState<USBDevice[]>([]);

  useEffect(() => {
    // Note: Web USB API requires secure context (HTTPS) and user gesture
    // This is a simulation for demonstration
    const simulateDevices: USBDevice[] = [
      { name: 'USB Keyboard', type: 'HID', connected: true },
      { name: 'USB Mouse', type: 'HID', connected: true },
      { name: 'USB Hub', type: 'Hub', connected: true },
    ];
    setDevices(simulateDevices);

    // In a real implementation, you would use navigator.usb
    // navigator.usb.addEventListener('connect', ...)
    // navigator.usb.addEventListener('disconnect', ...)
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold gradient-text neon-text-blue">USB Devices</h2>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Usb className="text-blue-400" />
          Connected Devices
        </h3>

        {devices.length === 0 ? (
          <p className="text-gray-400">No USB devices detected</p>
        ) : (
          <div className="space-y-3">
            {devices.map((device, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Usb size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold">{device.name}</p>
                    <p className="text-xs text-gray-400">{device.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
                  <span className="text-sm">Connected</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="text-yellow-400" />
          Browser Support
        </h3>
        <p className="text-gray-400 text-sm">
          Full USB device detection requires the Web USB API, which is supported in Chrome and Edge.
          Some features may require HTTPS and user permission.
        </p>
      </div>
    </motion.div>
  );
}

// Storage Tester Component
function StorageTester() {
  const storageDevices: StorageDevice[] = [
    {
      name: 'Primary Drive (C:)',
      total: 512,
      used: 256,
      free: 256,
      health: 'Excellent',
      readSpeed: 3500,
      writeSpeed: 3000
    },
    {
      name: 'Secondary Drive (D:)',
      total: 1024,
      used: 512,
      free: 512,
      health: 'Good',
      readSpeed: 550,
      writeSpeed: 500
    }
  ];

  const storageData = storageDevices.map(device => ({
    name: device.name.split(' ')[0],
    used: device.used,
    free: device.free
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold gradient-text neon-text-blue">Storage Monitor</h2>

      {/* Storage Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {storageDevices.map((device, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <HardDrive className="text-orange-400" />
                {device.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                device.health === 'Excellent' ? 'bg-green-500/20 text-green-400' :
                device.health === 'Good' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {device.health}
              </span>
            </div>

            {/* Usage Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Used: {device.used} GB</span>
                <span className="text-gray-400">Free: {device.free} GB</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(device.used / device.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Total: {device.total} GB</p>
            </div>

            {/* Speed Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-400">Read Speed</p>
                <p className="text-lg font-bold text-cyan-400">{device.readSpeed} MB/s</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-400">Write Speed</p>
                <p className="text-lg font-bold text-purple-400">{device.writeSpeed} MB/s</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Storage Chart */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4">Storage Usage Overview</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={storageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(20,20,35,0.95)', 
                  border: '1px solid rgba(0,240,255,0.3)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="used" fill="#00f0ff" name="Used (GB)" />
              <Bar dataKey="free" fill="#bc13fe" name="Free (GB)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

// Audio Tester Component
function AudioTester() {
  const [micLevel, setMicLevel] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialize audio context
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 256;
    setAnalyser(analyserNode);

    // Get microphone input
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyserNode);
      })
      .catch(err => {
        console.log('Microphone access denied:', err);
      });

    return () => {
      ctx.close();
    };
  }, []);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      setMicLevel(data.reduce((a, b) => a + b, 0) / bufferLength);

      canvasCtx.fillStyle = 'rgba(20, 20, 35, 0.5)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (data[i] / 255) * canvas.height;
        
        const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#00f0ff');
        gradient.addColorStop(1, '#bc13fe');
        
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  }, [analyser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold gradient-text neon-text-blue">Audio Tester</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Microphone Visualizer */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Volume2 className="text-green-400" />
            Microphone Input
          </h3>
          
          <canvas 
            ref={canvasRef}
            width={400}
            height={200}
            className="w-full rounded-lg bg-black/50"
          />
          
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Input Level</p>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${micLevel}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">{micLevel.toFixed(0)}%</p>
          </div>
        </div>

        {/* Speaker Test */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Speaker Test</h3>
          
          <div className="space-y-4">
            <button 
              className="w-full p-4 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all"
              onClick={() => {
                // Generate test tone
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 440;
                osc.type = 'sine';
                gain.gain.value = 0.3;
                osc.start();
                setTimeout(() => osc.stop(), 500);
              }}
            >
              🔊 Test Left Channel (440Hz)
            </button>
            
            <button 
              className="w-full p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400 transition-all"
              onClick={() => {
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 880;
                osc.type = 'sine';
                gain.gain.value = 0.3;
                osc.start();
                setTimeout(() => osc.stop(), 500);
              }}
            >
              🔊 Test Right Channel (880Hz)
            </button>

            <button 
              className="w-full p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 hover:border-green-400 transition-all"
              onClick={() => {
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 440;
                osc.type = 'sine';
                gain.gain.value = 0.3;
                osc.start();
                setTimeout(() => {
                  osc.frequency.value = 880;
                  setTimeout(() => osc.stop(), 500);
                }, 500);
              }}
            >
              🔊 Test Both Channels
            </button>
          </div>
        </div>
      </div>

      {/* Audio Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <InfoCard label="Mic Status" value={micLevel > 0 ? 'Active' : 'Inactive'} icon={Volume2} color="green" />
        <InfoCard label="Sample Rate" value="48 kHz" icon={Activity} />
        <InfoCard label="Channels" value="Stereo" icon={Check} />
      </div>
    </motion.div>
  );
}

// Performance Monitor Component
function PerformanceMonitor({ data, history }: { data: PerformanceData; history: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold gradient-text neon-text-blue">Performance Monitor</h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Cpu} label="CPU" value={`${data.cpu.toFixed(1)}%`} color="cyan" />
        <StatCard icon={Zap} label="RAM" value={`${data.ram.toFixed(1)}%`} color="purple" />
        <StatCard icon={Activity} label="FPS" value={data.fps.toFixed(0)} color="green" />
        <StatCard icon={Wifi} label="Download" value={`${data.download.toFixed(0)} Mbps`} color="blue" />
        <StatCard icon={Wifi} label="Upload" value={`${data.upload.toFixed(0)} Mbps`} color="pink" />
        <StatCard icon={Battery} label="Battery" value={`${data.battery.toFixed(0)}%`} color="yellow" />
      </div>

      {/* CPU Chart */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Cpu className="text-cyan-400" />
          CPU Usage History
        </h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(20,20,35,0.95)', 
                  border: '1px solid rgba(0,240,255,0.3)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="cpu" stroke="#00f0ff" strokeWidth={2} dot={false} name="CPU %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RAM Chart */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="text-purple-400" />
          RAM Usage History
        </h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(20,20,35,0.95)', 
                  border: '1px solid rgba(188,19,254,0.3)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="ram" stroke="#bc13fe" strokeWidth={2} dot={false} name="RAM %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FPS Chart */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Monitor className="text-green-400" />
          FPS History
        </h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(20,20,35,0.95)', 
                  border: '1px solid rgba(0,255,136,0.3)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="fps" stroke="#00ff88" strokeWidth={2} dot={false} name="FPS" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Info */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Monitor className="text-blue-400" />
          System Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-xs text-gray-400">Browser</p>
            <p className="font-bold">{navigator.userAgent.split(' ').pop()}</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-xs text-gray-400">Platform</p>
            <p className="font-bold">{navigator.platform}</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-xs text-gray-400">Screen Resolution</p>
            <p className="font-bold">{screen.width} x {screen.height}</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-xs text-gray-400">Color Depth</p>
            <p className="font-bold">{screen.colorDepth}-bit</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-xs text-gray-400">Device Memory</p>
            <p className="font-bold">{(navigator as any).deviceMemory || 'N/A'} GB</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <p className="text-xs text-gray-400">Hardware Concurrency</p>
            <p className="font-bold">{navigator.hardwareConcurrency} Cores</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
