import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ArrowLeft,
  Gift,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { VoucherWinData } from '../types';

// Declare global callbacks for webapp integration
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: VoucherWinData) => void;
    onFlappyVoucherLose?: (data: { score: number; timestamp: string }) => void;
  }
}

// ----------------------------------------------------
// GAME CONFIGURATION VARIABLES (as specified in PDF 5)
// ----------------------------------------------------
const WIN_SCORE = 20;
const GRAVITY = 0.26; // Easier than original Flappy Bird
const JUMP_FORCE = -5.8;
const PIPE_SPEED = 2.0;
const PIPE_GAP = 145; // Generous gap for relaxed counter customer experience
const VOUCHER_TEXT = 'Voucher 2 lít xăng';
const BRAND_NAME = 'VietinBank';
const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

interface GameFlappySectionProps {
  onBackToHome: () => void;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

export const GameFlappySection: React.FC<GameFlappySectionProps> = ({ onBackToHome }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game state
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'victory'>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('vietinbank_game_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [latestVoucher, setLatestVoucher] = useState<string | null>(() => {
    return localStorage.getItem('vietinbank_game_latest_voucher');
  });
  const [currentVoucher, setCurrentVoucher] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Web Audio Context for synthesizer sound effects (no external files needed)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (frequency: number, type: OscillatorType, duration: number) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context error or not supported
    }
  };

  // Internal physics & animation refs
  const animationFrameId = useRef<number | null>(null);
  const birdYRef = useRef<number>(200);
  const birdVelocityRef = useRef<number>(0);
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  // Helper: Motivational quotes based on score
  const getMotivationalQuote = (currentScore: number) => {
    if (currentScore < 5) return 'Khởi động nhẹ nhàng!';
    if (currentScore < 10) return 'Tốt lắm, tiếp tục nào!';
    if (currentScore < 15) return 'Một nửa chặng đường rồi!';
    if (currentScore < 20) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  // Generate voucher code: VB-XXXXXX
  const generateVoucherCode = useCallback(() => {
    const random6 = Math.floor(100000 + Math.random() * 900000);
    return `VB-${random6}`;
  }, []);

  // Copy voucher code
  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // End Game (Collision / Loss)
  const endGame = useCallback(() => {
    isPlayingRef.current = false;
    setGameState('gameover');
    playTone(180, 'sawtooth', 0.25);

    // Light haptic feedback if supported
    if (navigator.vibrate) {
      try {
        navigator.vibrate(40);
      } catch {
        // Vibrate not permitted
      }
    }

    const finalScore = scoreRef.current;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('vietinbank_game_highscore', finalScore.toString());
    }

    // Trigger external callback if registered
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString()
      });
    }
  }, [highScore]);

  // Win Game (Reached 20 points)
  const winGame = useCallback(() => {
    isPlayingRef.current = false;
    setGameState('victory');

    const newVoucher = generateVoucherCode();
    setCurrentVoucher(newVoucher);
    setLatestVoucher(newVoucher);
    setHighScore(WIN_SCORE);

    localStorage.setItem('vietinbank_game_highscore', WIN_SCORE.toString());
    localStorage.setItem('vietinbank_game_latest_voucher', newVoucher);

    playTone(600, 'sine', 0.15);
    setTimeout(() => playTone(800, 'sine', 0.3), 150);

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#004C97', '#ED1B2F', '#FFD700', '#00A859']
      });
    } catch {
      // Confetti fallback
    }

    // Trigger external callback if registered
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: newVoucher,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString()
      });
    }
  }, [generateVoucherCode]);

  // Reset Game
  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    birdYRef.current = canvas.height / 2;
    birdVelocityRef.current = 0;
    pipesRef.current = [];
    scoreRef.current = 0;
    frameCountRef.current = 0;
    setScore(0);
  }, []);

  // Jump Action
  const jump = useCallback(() => {
    if (!isPlayingRef.current) return;
    birdVelocityRef.current = JUMP_FORCE;
    playTone(400, 'sine', 0.08);
  }, []);

  // Start Game
  const startGame = useCallback(() => {
    resetGame();
    isPlayingRef.current = true;
    setGameState('playing');
    jump();
  }, [resetGame, jump]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle responsive canvas sizing
    const updateCanvasSize = () => {
      if (containerRef.current && canvas) {
        const width = Math.min(containerRef.current.clientWidth, 480);
        canvas.width = width;
        canvas.height = 540;
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Game loop
    const loop = () => {
      if (isPlayingRef.current) {
        frameCountRef.current++;
        const width = canvas.width;
        const height = canvas.height;

        // 1. Update Bird
        birdVelocityRef.current += GRAVITY;
        birdYRef.current += birdVelocityRef.current;

        const birdX = 70;
        const birdRadius = 16;

        // Ground & Ceiling collision
        if (birdYRef.current + birdRadius >= height - 20) {
          birdYRef.current = height - 20 - birdRadius;
          endGame();
        }
        if (birdYRef.current - birdRadius <= 0) {
          birdYRef.current = birdRadius;
          birdVelocityRef.current = 0;
        }

        // 2. Spawn Pipes
        if (frameCountRef.current % 115 === 0) {
          const minPipe = 70;
          const maxPipe = height - PIPE_GAP - minPipe - 30;
          const topHeight = Math.floor(minPipe + Math.random() * (maxPipe - minPipe));
          const bottomHeight = height - topHeight - PIPE_GAP;

          pipesRef.current.push({
            x: width,
            topHeight,
            bottomHeight,
            passed: false
          });
        }

        // 3. Move & Check Pipes
        const pipeWidth = 52;
        for (let i = 0; i < pipesRef.current.length; i++) {
          const pipe = pipesRef.current[i];
          pipe.x -= PIPE_SPEED;

          // Score check
          if (!pipe.passed && pipe.x + pipeWidth < birdX - birdRadius) {
            pipe.passed = true;
            scoreRef.current += 1;
            const newScore = scoreRef.current;
            setScore(newScore);
            playTone(520, 'sine', 0.1);

            if (newScore >= WIN_SCORE) {
              winGame();
              return;
            }
          }

          // Collision check
          const birdBoxLeft = birdX - birdRadius + 4;
          const birdBoxRight = birdX + birdRadius - 4;
          const birdBoxTop = birdYRef.current - birdRadius + 4;
          const birdBoxBottom = birdYRef.current + birdRadius - 4;

          const pipeBoxLeft = pipe.x;
          const pipeBoxRight = pipe.x + pipeWidth;

          // Top pipe collision
          if (
            birdBoxRight > pipeBoxLeft &&
            birdBoxLeft < pipeBoxRight &&
            birdBoxTop < pipe.topHeight
          ) {
            endGame();
            return;
          }

          // Bottom pipe collision
          if (
            birdBoxRight > pipeBoxLeft &&
            birdBoxLeft < pipeBoxRight &&
            birdBoxBottom > height - pipe.bottomHeight
          ) {
            endGame();
            return;
          }
        }

        // Remove off-screen pipes
        pipesRef.current = pipesRef.current.filter((p) => p.x + pipeWidth > -20);

        // 4. Render Background
        ctx.clearRect(0, 0, width, height);

        // Sky gradient: VietinBank sky blue
        const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#E0F2FE');
        skyGradient.addColorStop(0.7, '#BAE6FD');
        skyGradient.addColorStop(1, '#7DD3FC');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, width, height);

        // Cloud decoration
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(80, 70, 30, 0, Math.PI * 2);
        ctx.arc(115, 60, 40, 0, Math.PI * 2);
        ctx.arc(150, 70, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(width - 100, 110, 25, 0, Math.PI * 2);
        ctx.arc(width - 70, 100, 35, 0, Math.PI * 2);
        ctx.arc(width - 40, 110, 25, 0, Math.PI * 2);
        ctx.fill();

        // 5. Render Pipes (VietinBank Blue / Gold Accents)
        for (const pipe of pipesRef.current) {
          // Top Pipe Body
          ctx.fillStyle = '#004C97';
          ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
          // Top Pipe Cap
          ctx.fillStyle = '#003366';
          ctx.fillRect(pipe.x - 4, pipe.topHeight - 18, pipeWidth + 8, 18);
          // Highlight stripe
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(pipe.x + 4, 0, 4, pipe.topHeight - 18);

          // Bottom Pipe Body
          ctx.fillStyle = '#004C97';
          ctx.fillRect(pipe.x, height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
          // Bottom Pipe Cap
          ctx.fillStyle = '#003366';
          ctx.fillRect(pipe.x - 4, height - pipe.bottomHeight, pipeWidth + 8, 18);
          // Highlight stripe
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(pipe.x + 4, height - pipe.bottomHeight + 18, 4, pipe.bottomHeight - 18);
        }

        // Ground Strip
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, height - 20, width, 20);
        ctx.fillStyle = '#ED1B2F'; // VietinBank red band
        ctx.fillRect(0, height - 24, width, 4);

        // 6. Render Mascot / Flying Card Bird
        ctx.save();
        ctx.translate(birdX, birdYRef.current);
        const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (birdVelocityRef.current * 4 * Math.PI) / 180));
        ctx.rotate(rotation);

        // Draw Winged Bank Card (representing VietinBank card)
        // Card body (Red with white logo accent)
        ctx.fillStyle = '#ED1B2F';
        ctx.beginPath();
        ctx.roundRect(-18, -12, 36, 24, 4);
        ctx.fill();

        // Golden EMV Chip
        ctx.fillStyle = '#FBBF24';
        ctx.fillRect(-12, -4, 8, 8);

        // Card Logo dot / stripe
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-2, -8, 14, 3);
        ctx.fillRect(-2, 4, 14, 2);

        // Wing
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        const wingFlap = Math.sin(frameCountRef.current * 0.3) * 6;
        ctx.ellipse(-4, 2 + wingFlap, 9, 6, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Eye / Friendly face
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(10, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(11, -4, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [endGame, winGame]);

  // Handle Keyboard (Space to jump)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'start' || gameState === 'gameover') {
          startGame();
        } else if (gameState === 'playing') {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump, startGame]);

  return (
    <div id="flappy-voucher-game" className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            id="game-back-home-btn"
            onClick={onBackToHome}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#004C97] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-semibold text-[#ED1B2F] uppercase tracking-wider">
              Tính năng 03 • Quà tặng tại quầy
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {GAME_TITLE}
            </h1>
          </div>
        </div>

        {/* Sound toggle & High Score */}
        <div className="flex items-center gap-2">
          <button
            id="game-toggle-sound-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? 'bg-blue-50 border-blue-200 text-[#004C97]'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Bật' : 'Tắt'}</span>
          </button>

          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Kỷ lục: {highScore}/20</span>
          </div>
        </div>
      </div>

      {/* Main Game Arena Container */}
      <div
        ref={containerRef}
        className="relative max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg border border-slate-300 bg-slate-900 touch-none select-none"
        onPointerDown={(e) => {
          // Prevent scroll and pinch-zoom on mobile
          e.preventDefault();
          if (gameState === 'playing') {
            jump();
          }
        }}
      >
        {/* Canvas Display */}
        <canvas
          ref={canvasRef}
          className="block w-full h-[540px] cursor-pointer"
        />

        {/* Live HUD Overlay (when playing) */}
        {gameState === 'playing' && (
          <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none flex flex-col items-center">
            {/* Score & Progress Bar */}
            <div className="w-full max-w-[280px] bg-slate-900/75 backdrop-blur-xs rounded-xl p-2.5 text-white border border-white/20 shadow-md">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Điểm: {score}/{WIN_SCORE}</span>
                <span className="text-amber-400 font-extrabold">
                  {Math.round((score / WIN_SCORE) * 100)}%
                </span>
              </div>

              {/* Progress Bar 0 to 20 */}
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-200"
                  style={{ width: `${(score / WIN_SCORE) * 100}%` }}
                />
              </div>

              {/* Dynamic motivational quote based on score */}
              <p className="mt-1.5 text-center text-[11px] font-semibold text-cyan-200">
                {getMotivationalQuote(score)}
              </p>
            </div>
          </div>
        )}

        {/* Screen 1: Start Screen */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ED1B2F] to-[#004C97] p-1 flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-9 h-9 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                {GAME_TITLE}
              </h2>
              <p className="mt-1 text-xs text-blue-200 max-w-xs mx-auto">
                {contentData.gameConfig.description}
              </p>
            </div>

            <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-xs text-amber-300 font-medium">
              🎁 Phần thưởng: <strong>{VOUCHER_TEXT}</strong>
            </div>

            <button
              id="game-start-btn"
              onClick={startGame}
              className="w-full max-w-xs py-3.5 bg-gradient-to-r from-[#ED1B2F] to-[#C71020] hover:from-red-600 hover:to-red-800 text-white font-bold rounded-xl text-sm shadow-md hover:scale-102 active:scale-98 transition-all"
            >
              Bắt đầu chơi
            </button>

            <p className="text-[11px] text-slate-300">
              {contentData.gameConfig.instructions}
            </p>

            {latestVoucher && (
              <div className="pt-2 border-t border-white/15 w-full text-xs">
                <span className="text-slate-400">Mã voucher gần nhất của bạn: </span>
                <span className="font-mono font-bold text-amber-400">{latestVoucher}</span>
              </div>
            )}
          </div>
        )}

        {/* Screen 2: Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Flame className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Rất tiếc, bạn đã vượt qua {score}/{WIN_SCORE} thử thách
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                {contentData.gameConfig.loseMessage}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 w-full max-w-xs pt-2">
              <button
                id="game-retry-btn"
                onClick={startGame}
                className="w-full py-3 bg-[#004C97] hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>

              <button
                id="game-back-to-home-btn"
                onClick={onBackToHome}
                className="w-full py-2.5 bg-white/15 hover:bg-white/20 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Screen 3: Victory Screen */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-blue-950/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/40">
              <Award className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-amber-300">
                Chúc mừng!
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-200">
                {contentData.gameConfig.winMessage}
              </p>
            </div>

            {/* Voucher Box (Mandated VB-XXXXXX) */}
            <div className="w-full max-w-xs p-4 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-2xl border-2 border-amber-400/80 shadow-lg space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200">
                Mã nhận quà của bạn
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-300 tracking-wider">
                {currentVoucher}
              </div>
              <p className="text-[11px] text-slate-300">
                {contentData.gameConfig.claimNotice}
              </p>
            </div>

            {/* Buttons: Copy Code & Play Again */}
            <div className="flex flex-col gap-2.5 w-full max-w-xs pt-1">
              <button
                id="game-copy-voucher-btn"
                onClick={() => copyVoucherCode(currentVoucher)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Đã sao chép mã quà tặng!' : 'Sao chép mã'}</span>
              </button>

              <button
                id="game-play-again-btn"
                onClick={startGame}
                className="w-full py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                Chơi lại
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Counter Promotion & Rule Highlights */}
      <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-600">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Quy chế nhận quà tại quầy VietinBank</span>
        </div>
        <p>• Mỗi lượt khách hàng hoàn thành 20 thử thách sẽ nhận ngay mã quà tặng hợp lệ.</p>
        <p>• Đưa mã nhận quà trên màn hình cho giao dịch viên hoặc Chuyên viên tư vấn {contentData.brand.advisor.name} để nhận voucher trực tiếp.</p>
      </div>
    </div>
  );
};
